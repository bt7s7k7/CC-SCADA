import { StoredValue } from "../../data/DataStore"
import { ensureBoolean } from "../../support/support"
import { ComponentManifest } from "../Component"
import { Operator } from "./Operator"



abstract class Logic extends Operator {
    public getParameterCount(): number {
        return 2
    }

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: []
        }
    }

    protected abstract _evaluate(a: boolean, b: boolean): StoredValue

    public evaluate(args: StoredValue[]): StoredValue {
        let a = ensureBoolean(args[0])
        let b = ensureBoolean(args[1])
        return this._evaluate(a, b)
    }
}

export class AndOperator extends Logic {
    protected _evaluate(a: boolean, b: boolean): StoredValue {
        return a && b
    }
}

export class OrOperator extends Logic {
    protected _evaluate(a: boolean, b: boolean): StoredValue {
        return a || b
    }
}

export class NegateOperator extends Operator {
    public getManifest(): ComponentManifest {
        return { subComponentType: null, fields: [] }
    }

    public getParameterCount(): number {
        return 1
    }

    public evaluate(args: StoredValue[]): StoredValue | null {
        return !ensureBoolean(args[0])
    }
}

export class ChoiceOperator extends Operator {
    public getManifest(): ComponentManifest {
        return { subComponentType: null, fields: [] }
    }

    public getParameterCount(): number {
        return 3
    }

    public evaluate(args: StoredValue[]): StoredValue | null {
        return ensureBoolean(args[2]) ? args[0] : args[1]
    }
}
