import { FieldType } from "../../app/config"
import { ComponentManifest } from "../Component"
import { ComputeValue, Operator } from "./Operator"

abstract class Constant extends Operator {
    public value: any = null

    public getParameterCount(): number {
        return 0
    }

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "value", type: this._type }
            ]
        }
    }

    public evaluate(args: ComputeValue[]): ComputeValue {
        return this.value
    }

    constructor(
        protected readonly _type: FieldType
    ) { super() }
}

export class NumberConstant extends Constant { constructor() { super("number") } }
export class BooleanConstant extends Constant { constructor() { super("boolean") } }
export class StringConstant extends Constant { constructor() { super("string") } }
