import { Widget } from "../../drawing/Widget"
import { ComponentManifest } from "../Component"
import { UIField } from "./UIField"

export class MessageField extends UIField {
    public message = ""
    public output: string | null = null

    public getLabel(): string {
        return this.message
    }

    public render(): Widget {
        return new Widget({
            content: this.output == null ? [
                this.monitor.renderLabelFor(this)
            ] : [
                this.monitor.renderLabelFor(this),
                new Widget({ content: this.output, style: "output" })
            ]
        })
    }

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "message", type: "string" },
                { name: "output", type: "string", optional: true }
            ]
        }
    }
}
