import { DataStore } from "../../data/DataStore"
import { Widget } from "../../drawing/Widget"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { ComponentManifest } from "../Component"
import { UIField } from "./UIField"

export class SwitchField extends UIField implements EventHandler {
    public key = ""
    public label: string | null = null

    protected _store = DataStore.of("boolean")
    protected _lastValue = false

    public init(): void {
        this._store.init({
            defaultValue: this._lastValue,
            key: this.key,
            owner: true,
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
        return new Widget({
            content: [
                new Widget({ content: this.label ?? this.key }),
                new Widget({ grow: true }),
                new Widget({ content: " OFF ", style: this._lastValue == false ? "error" : "secondary", onClick: () => this._store.setValue(false) }),
                new Widget({ content: " ON ", style: this._lastValue == true ? "success" : "secondary", onClick: () => this._store.setValue(true) })
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
