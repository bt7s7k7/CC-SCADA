import { Drawer } from "../drawing/Drawer"
import { Widget } from "../drawing/Widget"
import { EventLoop, ListenerHandle } from "../support/EventLoop"
import { Logger } from "../support/Logger"
import { DeviceFoundEvent, DeviceLostEvent } from "../system/DeviceManager"
import { Event, EventHandler } from "../system/Event"
import { System } from "../system/System"
import { Component, ComponentManifest, registerComponent } from "./Component"

export abstract class UIField extends Component {
    public monitor: MonitorComponent = null!

    public abstract render(): Widget
}

export class MonitorComponent extends Component implements EventHandler {
    public monitor = ""
    public fields: UIField[] = []
    public drawer: Drawer | null = null
    public scroll = -1
    public readonly system = System.getSystem()

    protected _frame = 0


    public getManifest(): ComponentManifest {
        return {
            subComponentType: UIField,
            fields: [
                { name: "monitor", type: "string" }
            ]
        }
    }

    public addSubcomponent(component: Component): void {
        if (!(component instanceof UIField)) Logger.abort("Component is not of correct type")

        component.monitor = this
        this.fields.push(component)
    }

    public handleEvent(event: Event): void {
        if (this.monitor == "main") return

        if (event instanceof DeviceFoundEvent && event.name == this.monitor && event.hasType("monitor")) {
            this.drawer = new Drawer(event.device)
            this.redraw()
        }

        if (event instanceof DeviceLostEvent && event.name == this.monitor) {
            this.drawer = null
            this.scroll = -1
        }
    }

    public redraw() {
        if (this.drawer == null) Logger.abort()

        const root = new Widget({
            style: "secondary",
            axis: "column",
            content: [
                new Widget({
                    content: `\xB7${this.system.name}`,
                    style: "primary"
                }),
                new Widget({
                    axis: "column",
                    content: this.fields.map(v => v.render())
                })
            ]
        })

        Widget.calculateLayout(root, this.drawer.size)
        Widget.draw(root, this.drawer)

        this._frame++
    }

    constructor() {
        super()

        this.system.registerEventHandler(this)

        EventLoop.setImmediate(() => {
            if (this.monitor == "main") {
                this.drawer = new Drawer(term.current())
                this.redraw()
            }

            const listener = new ListenerHandle()
            EventLoop.subscribe(listener, "monitor_resize", (event) => {
                if (this.drawer == null) return
                this.drawer = new Drawer(this.drawer.ctx)
                this.redraw()
            }, { match: { "1": this.monitor } })

            EventLoop.setInterval(listener, 0.5, () => {
                this.redraw()
            })
        })
    }
}

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

registerComponent("Monitor", MonitorComponent)
registerComponent("MessageField", MessageField)

