import { Drawer } from "../../drawing/Drawer"
import { Point } from "../../drawing/Point"
import { Widget } from "../../drawing/Widget"
import { EventLoop, ListenerHandle } from "../../support/EventLoop"
import { Logger } from "../../support/Logger"
import { DeviceFoundEvent, DeviceLostEvent } from "../../system/DeviceManager"
import { DomainAcquiredEvent, DomainLostEvent } from "../../system/DomainProxy"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { Component, ComponentManifest, registerComponent } from "../Component"
import { MessageField } from "./MessageField"
import { SwitchField } from "./SwitchField"
import { UIField } from "./UIField"
import { ValueField } from "./ValueField"

export class MonitorComponent extends Component implements EventHandler {
    public monitor = ""
    public fields: UIField[] = []
    public drawer: Drawer | null = null
    public scroll = -1
    public readonly system = System.getSystem()

    protected _frame = 0
    protected _redrawPending = false
    protected _lastWidgets: Widget[] = []
    protected _connected = false

    public getManifest(): ComponentManifest {
        return {
            subComponentType: UIField,
            fields: [
                { name: "monitor", type: "string" }
            ]
        }
    }

    public getFrame() {
        return this._frame
    }

    public addSubcomponent(component: Component): void {
        if (!(component instanceof UIField)) Logger.abort("Component is not of correct type")

        component.monitor = this
        this.fields.push(component)
    }

    public handleEvent(event: Event): void {
        if (event instanceof DomainAcquiredEvent) {
            this._connected = true
            this.redraw()
        }

        if (event instanceof DomainLostEvent) {
            this._connected = false
            this.redraw()
        }

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

    public redrawNow() {
        if (this.drawer == null) return

        let content: Widget[]
        if (this._connected) {
            content = this.fields.map(v => v.render())
        } else {
            content = [
                new Widget({ grow: true }),
                new Widget({
                    content: [
                        new Widget({ grow: true }),
                        new Widget({ content: "Connecting..." }),
                        new Widget({ grow: true })
                    ]
                }),
                new Widget({ grow: true })
            ]
        }

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
                    content: content
                })
            ]
        })

        Widget.calculateLayout(root, this.drawer.size)
        this._lastWidgets = Widget.draw(root, this.drawer)
    }

    public redraw() {
        if (this._redrawPending) return
        this._redrawPending = true

        EventLoop.setImmediate(() => {
            this._redrawPending = false
            this.redrawNow()
        })
    }

    protected _handleClick(pos: Point) {
        for (const widget of this._lastWidgets) {
            if (
                widget.position.x <= pos.x && widget.position.y <= pos.y &&
                widget.position.x + widget.size.x >= pos.x && widget.position.y + widget.size.y >= pos.y
            ) {
                widget.onClick?.()
                return
            }
        }
    }

    constructor() {
        super()

        this.system.registerEventHandler(this)

        EventLoop.setImmediate(() => {
            for (const field of this.fields) {
                field.init()
            }

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

            if (this.monitor != "main") {
                EventLoop.subscribe(listener, "monitor_touch", (event) => {
                    this._handleClick(new Point(event["2"] - 1, event["3"] - 1))
                }, { match: { "1": this.monitor } })
            } else {
                EventLoop.subscribe(listener, "mouse_click", (event) => {
                    this._handleClick(new Point(event["2"] - 1, event["3"] - 1))
                })
            }

            EventLoop.setInterval(listener, 0.5, () => {
                this.redraw()
                this._frame++
            })
        })
    }
}

registerComponent("Monitor", MonitorComponent)
registerComponent("Message", MessageField)
registerComponent("Value", ValueField)
registerComponent("Switch", SwitchField)

