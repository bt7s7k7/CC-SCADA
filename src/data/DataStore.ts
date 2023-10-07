import { Logger } from "../support/Logger"
import { Event } from "../system/Event"
import { DataStoreInitEvent } from "./DataStoreInitEvent"
import { DataStoreManager } from "./DataStoreManager"

export interface DataTypeMap {
    "string": string
    "number": number
    "boolean": boolean
    "any": StoredValue | null
}

const TYPE_REPS = {
    "string": "string",
    "number": "number",
    "boolean": "boolean"
} as const

export type StoredValue = string | number | boolean

interface Options<T> {
    owner: boolean
    defaultValue: T
    handler?: (value: T) => void
    key: string
}

export class DataStore<T extends StoredValue | null = StoredValue | null> {
    protected _options: Options<T> | null = null
    protected _manager: DataStoreManager | null = null

    public handleUpdate(event: Event) {
        if (event instanceof DataStoreInitEvent) {
            if (this._options == null) Logger.abort("A DataStore was updated but not initialized")
            event.stores.push(this as DataStore<any>)
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
        if (this._manager == null) Logger.abort("Tried to operate on DataStore before init")
        this._manager.setValue(this._options!.key, value)
    }

    public getValue() {
        if (this._manager == null) Logger.abort("Tried to operate on DataStore before init")
        return this._manager.getValue(this._options!.key) ?? this._options!.defaultValue
    }

    public setObject(object: Map<string, StoredValue>) {
        if (this._manager == null) Logger.abort("Tried to operate on DataStore before init")
        this._manager.setObject(this._options!.key, object)
    }

    public getObject() {
        if (this._manager == null) Logger.abort("Tried to operate on DataStore before init")
        return this._manager.getObject(this._options!.key)
    }

    protected constructor(
        public readonly type: keyof DataTypeMap
    ) { }

    public static of<K extends keyof DataTypeMap>(type: K): DataStore<DataTypeMap[K]> {
        return new DataStore(type)
    }
}


