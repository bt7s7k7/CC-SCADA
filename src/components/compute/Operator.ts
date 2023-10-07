import { StoredValue } from "../../data/DataStore"
import { Component } from "../Component"
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
