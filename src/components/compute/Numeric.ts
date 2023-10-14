import { StoredValue } from "../../data/DataStore"
import { ensureNumber } from "../../support/support"
import { ComponentManifest } from "../Component"
import { ComputeValue, Operator } from "./Operator"

abstract class Numeric extends Operator {
    public constant: number | null = null

    public getParameterCount(): number {
        return this.constant != null ? 1 : 2
    }

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "constant", type: "number", optional: true }
            ]
        }
    }

    protected abstract _evaluate(a: number, b: number): StoredValue

    public evaluate(args: ComputeValue[]): ComputeValue {
        let a = ensureNumber(args[0])
        let b = this.constant != null ? this.constant : ensureNumber(args[1])
        return this._evaluate(a, b)
    }
}

export class EqualsOperator extends Numeric {
    protected _evaluate(a: number, b: number): boolean {
        return a == b
    }
}

export class LessThanOperator extends Numeric {
    protected _evaluate(a: number, b: number): boolean {
        return a < b
    }
}

export class LessOrEqualsOperator extends Numeric {
    protected _evaluate(a: number, b: number): boolean {
        return a < b
    }
}

export class GreaterThanOperator extends Numeric {
    protected _evaluate(a: number, b: number): boolean {
        return a > b
    }
}

export class GreaterOrEqualsOperator extends Numeric {
    protected _evaluate(a: number, b: number): boolean {
        return a >= b
    }
}

export class AddOperator extends Numeric {
    protected _evaluate(a: number, b: number): StoredValue {
        return a + b
    }
}

export class SubOperator extends Numeric {
    protected _evaluate(a: number, b: number): StoredValue {
        return a + b
    }
}

export class MulOperator extends Numeric {
    protected _evaluate(a: number, b: number): StoredValue {
        return a + b
    }
}

export class DivOperator extends Numeric {
    protected _evaluate(a: number, b: number): StoredValue {
        return a / b
    }
}

export class IntDivOperator extends Numeric {
    protected _evaluate(a: number, b: number): StoredValue {
        return Math.floor(a / b)
    }
}

export class ModOperator extends Numeric {
    protected _evaluate(a: number, b: number): StoredValue {
        return a % b
    }
}
