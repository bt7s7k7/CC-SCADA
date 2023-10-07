import { DataStore, StoredValue } from "../../data/DataStore"
import { Widget } from "../../drawing/Widget"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { ComponentManifest } from "../Component"
import { UIField } from "./UIField"

export class ArrayViewComponent extends UIField implements EventHandler {
    public key = ""
    public label: string | null = null

    protected _store = DataStore.of("number")
    protected _lastValue = new Map<string, StoredValue>()

    public getLabel(): string {
        return this.label ?? this.key
    }

    public init(): void {
        this._store.init({
            defaultValue: 0,
            key: this.key + ".*",
            owner: false,
            handler: (value) => {
                this._lastValue = this._store.getObject()
                this.monitor.redraw()
            }
        })

        System.getSystem().registerEventHandler(this)
    }

    public handleEvent(event: Event): void {
        this._store.handleUpdate(event)
    }

    public render(): Widget {
        return new Widget({
            overflow: "wrap",
            content: [
                this.monitor.renderLabelFor(this),
                ...(this._lastValue.size == 0 ? (
                    [new Widget({ content: "<empty>", style: "output" })]
                ) : (
                    [...this._lastValue]
                        .map(v => `${v[0]}: ${v[1]}`)
                        .map((v, i, a) => new Widget({ content: (i < a.length - 1 ? v + ", " : v), style: "output" }))
                ))
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
