import { Widget } from "../../drawing/Widget"
import { ComponentManifest } from "../Component"
import { UIField } from "./UIField"

export class MessageField extends UIField {
    public message = ""
    public output: string | null = null

    public render(): Widget {
        return new Widget({
            content: this.output == null ? [
                new Widget({ content: this.message })
            ] : [
                new Widget({ content: this.message }),
                new Widget({ grow: true }),
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
