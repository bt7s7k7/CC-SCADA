import { Logger } from "../support/Logger"
import { Event } from "../system/Event"
import { DataStoreInitEvent } from "./DataStoreInitEvent"

interface DataTypeMap {
    "string": string
    "number": number
    "boolean": boolean
    "list": string[]
    "any": StoredValue
}

const TYPE_REPS = {
    "string": "string",
    "number": "number",
    "boolean": "boolean",
    "list": "object",
} as const

export type StoredValue = string | number | boolean | string[]

interface Options<T> {
    owner: boolean
    defaultValue: T
    handler?: (value: T) => void
    key: string
}

export class DataStore<T extends StoredValue = StoredValue> {
    protected _options: Options<T> | null = null
    protected _init: DataStoreInitEvent | null = null

    public update(event: Event) {
        if (event instanceof DataStoreInitEvent) {
            if (this._options == null) Logger.abort("A DataStore was updated but not initialized")
            event.stores.push(this as DataStore<any>)
            this._init = event
        }
    }

    public init(options: Options<T>) {
        this._options = options
    }

    protected _handleUpdate(value: StoredValue | null) {
        const { handler, defaultValue, key } = this._options!
        if (!handler) return

        if (value == null) {
            handler(defaultValue)
        } else {
            if (this.type != "any" && TYPE_REPS[this.type] != typeof value) {
                Logger.printError(`Update to "${key}" is not of type "${this.type}" (${typeof value})`)
                handler(defaultValue)
            } else {
                handler(value as T)
            }
        }
    }

    public setValue(value: T) {
        if (this._init == null) Logger.abort("Tried to set value on DataStore before init")
        this._init.update(this._options!.key, value)
    }

    protected constructor(
        public readonly type: keyof DataTypeMap
    ) { }

    public static of<K extends keyof DataTypeMap>(type: K): DataStore<DataTypeMap[K]> {
        return new DataStore(type)
    }
}


