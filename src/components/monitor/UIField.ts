import { Widget } from "../../drawing/Widget"
import { Component } from "../Component"
import { MonitorComponent } from "./Monitor"


export abstract class UIField extends Component {
    public monitor: MonitorComponent = null!

    public abstract getLabel(): string
    public abstract render(): Widget
    public init() { }
    public action() { }
}
