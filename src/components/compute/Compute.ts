import { StoredValue } from "../../data/DataStore"
import { EventLoop } from "../../support/EventLoop"
import { Logger } from "../../support/Logger"
import { DomainAcquiredEvent } from "../../system/DomainProxy"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { Component, ComponentManifest, registerComponent } from "../Component"
import { BooleanConstant, NumberConstant, StringConstant } from "./Constant"
import { DataReadOperator, DataWriteOperator } from "./Data"
import { AndOperator, ChoiceOperator, NegateOperator, OrOperator } from "./Logic"
import { AddOperator, DivOperator, EqualsOperator, GreaterOrEqualsOperator, GreaterThanOperator, IntDivOperator, LessOrEqualsOperator, LessThanOperator, ModOperator, MulOperator, SubOperator } from "./Numeric"
import { Operator, PollOperator } from "./Operator"
import { AnalogRedstoneInputOperator, AnalogRedstoneOutputOperator, RedstoneInputOperator, RedstoneOutputOperator } from "./Redstone"

export class ComputeComponent extends Component implements EventHandler {
    public operators: Operator[] = []

    protected _refreshPending = false

    public getManifest(): ComponentManifest {
        return {
            subComponentType: Operator,
            fields: []
        }
    }

    public addSubcomponent(component: Component): void {
        if (!(component instanceof Operator)) Logger.abort("Component is not of correct type")
        component.owner = this
        this.operators.push(component)
    }

    protected refreshNow() {
        const stack: (StoredValue | null)[] = []

        for (const operator of this.operators) {
            const paramCount = operator.getParameterCount()
            const args = stack.splice(stack.length - paramCount, paramCount)
            const result = operator.evaluate(args)
            if (operator.hasResult()) stack.push(result)
        }
    }

    public refresh() {
        if (this._refreshPending) return
        this._refreshPending = true

        EventLoop.queueMicrotask(() => {
            this._refreshPending = false
            this.refreshNow()
        })
    }

    public handleEvent(event: Event): void {
        if (event instanceof DomainAcquiredEvent) {
            this.refresh()
        }
    }

    constructor() {
        super()

        EventLoop.setImmediate(() => {
            for (const operator of this.operators) {
                operator.init()
            }

            let stackLength = 0
            const debug: string[] = []
            for (const operator of this.operators) {
                const inCount = operator.getParameterCount()
                const outCount = operator.hasResult() ? 1 : 0
                stackLength -= inCount
                if (stackLength < 0) Logger.abort("Consumed too many values from stack")
                stackLength += outCount
                debug.push(`${inCount} -> ${outCount}`)
            }
            if (stackLength > 0) Logger.abort(`Leftover values on stack (${debug.join(", ")})`)
        })

        System.getSystem().registerEventHandler(this)
    }
}

registerComponent("Compute", ComputeComponent)
registerComponent("Equals", EqualsOperator)
registerComponent("LessThan", LessThanOperator)
registerComponent("LessOrEquals", LessOrEqualsOperator)
registerComponent("GreaterThan", GreaterThanOperator)
registerComponent("GreaterOrEquals", GreaterOrEqualsOperator)
registerComponent("Add", AddOperator)
registerComponent("Sub", SubOperator)
registerComponent("Mul", MulOperator)
registerComponent("Div", DivOperator)
registerComponent("IntDiv", IntDivOperator)
registerComponent("Mod", ModOperator)
registerComponent("DataWrite", DataWriteOperator)
registerComponent("DataRead", DataReadOperator)
registerComponent("Number", NumberConstant)
registerComponent("Boolean", BooleanConstant)
registerComponent("String", StringConstant)
registerComponent("And", AndOperator)
registerComponent("Or", OrOperator)
registerComponent("Negate", NegateOperator)
registerComponent("Choice", ChoiceOperator)
registerComponent("RedstoneInput", RedstoneInputOperator)
registerComponent("RedstoneOutput", RedstoneOutputOperator)
registerComponent("AnalogRedstoneInput", AnalogRedstoneInputOperator)
registerComponent("AnalogRedstoneOutput", AnalogRedstoneOutputOperator)
registerComponent("Poll", PollOperator)
