import { EventLoop } from "../../support/EventLoop"
import { Logger } from "../../support/Logger"
import { ensureKey } from "../../support/support"
import { System } from "../../system/System"
import { ComponentManifest } from "../Component"
import { ComputeValue, Operator } from "../compute/Operator"

type InventoryReference = { name: string, filter: string | null }

export class LogisticTransfer {
    public inputs: InventoryReference[] = []
    public outputs: InventoryReference[] = []

    public execute() {
        const system = System.getSystem()

        EventLoop.executeAsync(() => {
            const inputSlots = new Map<string, { handle: inventory, slot: number, count: number }[]>()

            for (const input of this.inputs) {
                const handle = system.devices.tryGetDevice(input.name)
                if (handle != null && system.devices.hasType(handle, "inventory")) {
                    for (const [slot, item] of handle.list() as any as LuaTable<number, any>) {
                        const name = item.name
                        const count = item.count

                        if (input.filter == null || name == input.filter) {
                            ensureKey(inputSlots, name, () => []).push({ handle, count, slot })
                        }
                    }
                }
            }

            for (const output of this.outputs) {
                const handle = system.devices.tryGetDevice(output.name)
                if (handle != null && system.devices.hasType(handle, "inventory")) {
                    const source = output.filter != null ? new Map([[output.filter, inputSlots.get(output.filter)!]]) : inputSlots

                    for (const [name, slots] of source) {
                        if (slots == null) break

                        for (let i = 0; i < slots.length; i++) {
                            const slot = slots[i]
                            const transferred = slot.handle.pushItems(output.name, slot.slot)
                            slot.count -= transferred
                            if (slot.count <= 0) {
                                slots.splice(i, 1)
                                i--
                            }

                            if (transferred == 0) break
                        }

                        if (slots.length == 0) {
                            inputSlots.delete(name)
                        }
                    }
                }
            }
        })
    }
}

export class BeginTransferOperator extends Operator {
    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: []
        }
    }

    public getParameterCount(): number {
        return 0
    }

    public evaluate(args: ComputeValue[]): ComputeValue {
        return new LogisticTransfer()
    }
}

export class ExecuteTransferOperator extends Operator {
    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: []
        }
    }

    public getParameterCount(): number {
        return 1
    }

    public hasResult(): boolean {
        return false
    }

    public evaluate(args: ComputeValue[]): ComputeValue {
        const transfer = args[0]
        if (!(transfer instanceof LogisticTransfer)) Logger.abort("ExecuteTransfer received value that is not a LogisticTransfer")
        transfer.execute()
        return null
    }
}

abstract class IOOperatorBase extends Operator {
    public inventory = ""
    public filter: string | null = null

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "inventory", type: "string" },
                { name: "filter", type: "string", optional: true },
            ]
        }
    }

    public getParameterCount(): number {
        return 1
    }

    public evaluate(args: ComputeValue[]): ComputeValue {
        const transfer = args[0]
        if (!(transfer instanceof LogisticTransfer)) Logger.abort("IO operator received value that is not a LogisticTransfer")
        this._execute(transfer)
        return transfer
    }

    protected abstract _execute(transfer: LogisticTransfer): void
}

export class InputOperator extends IOOperatorBase {
    protected _execute(transfer: LogisticTransfer): void {
        transfer.inputs.push({ name: this.inventory, filter: this.filter })
    }
}

export class OutputOperator extends IOOperatorBase {
    protected _execute(transfer: LogisticTransfer): void {
        transfer.outputs.push({ name: this.inventory, filter: this.filter })
    }
}
