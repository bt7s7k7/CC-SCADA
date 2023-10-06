import { DataStore, StoredValue } from "../../data/DataStore"
import { Widget } from "../../drawing/Widget"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { ComponentManifest } from "../Component"
import { UIField } from "./UIField"


export class ValueField extends UIField implements EventHandler {
    public key = ""
    public label: string | null = null

    protected _store = DataStore.of("any")
    protected _lastValue: StoredValue = "<empty>"

    public init(): void {
        this._store.init({
            defaultValue: this._lastValue,
            key: this.key,
            owner: false,
            handler: (value) => {
                this._lastValue = value
                this.monitor.redraw()
            }
        })

        System.getSystem().registerEventHandler(this)
    }

    public handleEvent(event: Event): void {
        this._store.update(event)
    }

    public render(): Widget {
        let output = ""
        if (typeof this._lastValue == "object") {
            output = "<array>" + this._lastValue.length
        } else {
            output = this._lastValue.toString()
        }

        return new Widget({
            content: [
                new Widget({ content: this.label ?? this.key }),
                new Widget({ grow: true }),
                new Widget({ content: output, style: "output" })
            ]
        })
    }

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "key", type: "string" },
                { name: "label", type: "string", optional: true }
            ]
        }
    }
}
