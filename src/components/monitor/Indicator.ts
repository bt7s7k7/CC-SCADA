import { DataStore } from "../../data/DataStore"
import { Widget } from "../../drawing/Widget"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { ComponentManifest } from "../Component"
import { UIField } from "./UIField"

export class IndicatorField extends UIField implements EventHandler {
    public key = ""
    public label: string | null = null

    protected _store = DataStore.of("boolean")
    protected _lastValue = false

    public getLabel(): string {
        return this.label ?? this.key
    }

    public action(): void {

    }

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
        return new Widget({
            content: [
                this.monitor.renderLabelFor(this),
                new Widget({ content: this._lastValue == true ? `${this.monitor.getFrame() % 2 == 0 ? "\x07 " : " \x07"}` : "\x88\x84" }),
                this._lastValue == true ? (
                    new Widget({ content: ` WORKING`, style: "output" })
                ) : (
                    new Widget({ content: " STOPPED", style: "output" })
                )
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
