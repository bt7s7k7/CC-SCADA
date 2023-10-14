import { EventLoop } from "../../support/EventLoop"
import { ensureBoolean } from "../../support/support"
import { Component, ComponentManifest } from "../Component"
import { ComputeComponent } from "./Compute"

export type ComputeValue = {} | null

export abstract class Operator extends Component {
    public owner: ComputeComponent = null!

    public abstract getParameterCount(): number
    public hasResult() {
        return true
    }
    public abstract evaluate(args: ComputeValue[]): ComputeValue
    public init() {

    }

    public static readonly BREAK = Symbol("break")
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

    public evaluate(args: ComputeValue[]): ComputeValue {
        return null
    }

    public init(): void {
        EventLoop.setInterval(null, this.interval, () => {
            this.owner.refresh()
        })
    }
}

export class BreakOperator extends Operator {
    public enabled = false

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "enabled", type: "boolean", optional: true }
            ]
        }
    }

    public getParameterCount(): number {
        return this.enabled ? 0 : 1
    }

    public hasResult(): boolean {
        return false
    }

    public evaluate(args: ComputeValue[]): ComputeValue {
        if (this.enabled || ensureBoolean(args[0])) return Operator.BREAK
        return null
    }
}

export class VoidOperator extends Operator {
    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: []
        }
    }

    public getParameterCount(): number {
        return 1
    }

    public hasResult(): boolean {
        return false
    }

    public evaluate(args: ComputeValue[]): ComputeValue {
        return null
    }
}
