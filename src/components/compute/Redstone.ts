import { StoredValue } from "../../data/DataStore"
import { EventLoop } from "../../support/EventLoop"
import { Logger } from "../../support/Logger"
import { ensureBoolean, ensureNumber } from "../../support/support"
import { DeviceFoundEvent, DeviceLostEvent } from "../../system/DeviceManager"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { ComponentManifest } from "../Component"
import { Operator } from "./Operator"

abstract class RedstoneBase extends Operator implements EventHandler {
    public side = ""
    public device: string | null = null

    protected _device: redrouter | null = null

    protected _getHandle() {
        if (this.device == null) {
            return redstone
        } else {
            return this._device
        }
    }

    public handleEvent(event: Event): void {
        if (event instanceof DeviceFoundEvent) {
            if (event.name != this.device) return
            if (!event.hasType("redrouter")) Logger.abort(`Found device "${this.device}" but it does not have type "redrouter"`)
            this._device = event.device
            this._handleChange()
            return
        }

        if (event instanceof DeviceLostEvent) {
            if (event.name != this.device) return
            this._device = null
        }
    }

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "side", type: "string" },
                { name: "device", type: "string", optional: true }
            ]
        }
    }

    protected abstract _handleChange(): void

    public init() {
        if (this.device != null) {
            const system = System.getSystem()
            system.registerEventHandler(this)

            const existingDevice = system.devices.tryGetDevice(this.device)
            if (system.devices.hasType(existingDevice, "redrouter")) {
                this._device = existingDevice
            }
        }
    }
}

export class RedstoneInputOperator extends RedstoneBase {
    public router: string | null = null

    protected _lastValue: number | boolean = false
    protected _isAnalog = false

    public getParameterCount(): number {
        return 0
    }

    public init() {
        super.init()

        const handle = this._getHandle()
        if (handle != null) {
            this._lastValue = this._isAnalog ? handle.getAnalogInput(this.side) : handle.getInput(this.side)
        }

        EventLoop.subscribe(null, "redstone", (event) => {
            this._handleChange()
        })
    }

    protected _handleChange(): void {
        const handle = this._getHandle()
        if (handle == null) return

        const newValue = this._isAnalog ? handle.getAnalogInput(this.side) : handle.getInput(this.side)
        if (this._lastValue == newValue) return

        this._lastValue = newValue
        this.owner.refresh()
    }

    public evaluate(args: (StoredValue | null)[]): StoredValue | null {
        if (this.device != null) {
            const handle = this._getHandle()
            if (handle != null) {
                this._lastValue = this._isAnalog ? handle.getAnalogInput(this.side) : handle.getInput(this.side)
            }
        }

        return this._lastValue
    }
}

export class AnalogRedstoneInputOperator extends RedstoneInputOperator {
    constructor() {
        super()
        this._isAnalog = true
    }
}

export class RedstoneOutputOperator extends RedstoneBase {
    public router: string | null = null

    protected _isAnalog = false
    protected _lastValue: any = null

    public getParameterCount(): number {
        return 1
    }

    public hasResult(): boolean {
        return false
    }

    protected _handleChange(): void {
        const handle = this._getHandle()
        Logger.debug("out", this._lastValue, handle == null)
        if (handle == null) return

        if (this._isAnalog) {
            handle.setAnalogOutput(this.side, ensureNumber(this._lastValue))
        } else {
            handle.setOutput(this.side, ensureBoolean(this._lastValue))
        }
    }

    public evaluate(args: (StoredValue | null)[]): StoredValue | null {
        this._lastValue = args[0]
        this._handleChange()

        return null
    }
}

export class AnalogRedstoneOutputOperator extends RedstoneOutputOperator {
    constructor() {
        super()
        this._isAnalog = true
    }
}
