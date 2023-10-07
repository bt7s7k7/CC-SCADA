import { StoredValue } from "../../data/DataStore"
import { EventLoop } from "../../support/EventLoop"
import { Component, ComponentManifest } from "../Component"
import { ComputeComponent } from "./Compute"

export abstract class Operator extends Component {
    public owner: ComputeComponent = null!

    public abstract getParameterCount(): number
    public hasResult() {
        return true
    }
    public abstract evaluate(args: (StoredValue | null)[]): StoredValue | null
    public init() {

    }
}

export class PollOperator extends Operator {
    public interval = -1

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "interval", type: "number" }
            ]
        }
    }

    public getParameterCount(): number {
        return 0
    }

    public hasResult(): boolean {
        return false
    }

    public evaluate(args: (StoredValue | null)[]): StoredValue | null {
        return null
    }

    public init(): void {
        EventLoop.setInterval(null, this.interval, () => {
            this.owner.refresh()
        })
    }
}
