import { DataStore, StoredValue } from "../../data/DataStore"
import { Logger } from "../../support/Logger"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { ComponentManifest } from "../Component"
import { Operator } from "./Operator"

export class DataWriteOperator extends Operator implements EventHandler {
    public id = ""

    protected _store = DataStore.of("any")

    public getParameterCount(): number {
        return 1
    }

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "id", type: "string" }
            ]
        }
    }

    public handleEvent(event: Event): void {
        this._store.handleUpdate(event)
    }

    public init(): void {
        this._store.init({
            key: this.id,
            defaultValue: null,
            owner: true
        })

        System.getSystem().registerEventHandler(this)
    }

    public evaluate(args: StoredValue[]): StoredValue | null {
        const value = args[0]
        this._store.setValue(value)
        return null
    }

    public hasResult(): boolean {
        return false
    }
}

export class DataReadOperator extends Operator implements EventHandler {
    public id = ""
    public set passive(value: string) {
        if (value == "passive") {
            this._passive = true
        } else {
            Logger.abort("Invalid settings flag for DataRead")
        }
    }

    protected _store = DataStore.of("any")
    protected _lastValue: StoredValue | null = null
    protected _passive = false

    public getParameterCount(): number {
        return 0
    }

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "id", type: "string" },
                { name: "passive", type: "string", optional: true },
            ]
        }
    }

    public handleEvent(event: Event): void {
        this._store.handleUpdate(event)
    }

    public init(): void {
        this._store.init({
            key: this.id,
            defaultValue: null,
            owner: false,
            handler: (value) => {
                this._lastValue = value
                if (!this._passive) {
                    this.owner.refresh()
                }
            },
        })

        System.getSystem().registerEventHandler(this)
    }

    public evaluate(args: StoredValue[]): StoredValue | null {
        return this._lastValue
    }
}
