import { Logger } from "../support/Logger"
import { SubscriptionMap } from "../support/SubscriptionMap"
import { mergeObject } from "../support/support"
import { DomainProxy, StoreKeyVal } from "../system/DomainProxy"
import { System } from "../system/System"
import { DataStore, StoredValue } from "./DataStore"
import { DataStoreInitEvent } from "./DataStoreInitEvent"

export class DataStoreManager {
    protected readonly _localReplica = new Map<string, StoredValue>()
    protected readonly _subscriptions = new SubscriptionMap<DataStore>()
    protected _domain: DomainProxy | null = null

    public getValue(key: string) {
        return this._localReplica.get(key) as StoredValue | null
    }

    public getObject(prefix: string) {
        if (prefix.endsWith(".*")) prefix = prefix.slice(0, -2)
        const object = new Map<string, StoredValue>()
        const prefixLength = prefix.length + 1
        for (const [key, value] of this._localReplica) {
            if (key.startsWith(prefix + ".")) {
                const localName = key.slice(prefixLength)
                object.set(localName, value)
            }
        }

        return object
    }

    public setValue(key: string, value: StoredValue | null) {
        if (this._domain == null) Logger.abort("Tried to update without domain")
        this._domain["_sendMessage"]({ kind: "domain:update", values: [{ key, value }] })
    }

    public setObject(prefix: string, object: Map<string, StoredValue>) {
        if (this._domain == null) Logger.abort("Tried to update without domain")
        if (prefix.endsWith(".*")) prefix = prefix.slice(0, -2)
        const modified = new Set<string>()
        mergeObject(prefix, object, this._localReplica, modified)
        const values: StoreKeyVal[] = []
        for (const key of modified) {
            values.push({ key, value: this._localReplica.get(key) as StoredValue | null })
        }
        this._domain["_sendMessage"]({ kind: "domain:update", values })
    }

    public handleInit(domain: DomainProxy): void {
        const init = new DataStoreInitEvent(this, domain)
        this._domain = domain
        this.system.emitEvent(init, { sync: true })

        const values = new Map<string, StoredValue | null>()
        for (const store of init.stores) {
            store["_manager"] = this
            const options = store["_options"]!
            if (options.handler != null) {
                this._subscriptions.subscribe(store, options.key)
            }

            if (options.owner) {
                values.set(options.key, options.defaultValue)
            } else {
                values.set(options.key, null)
            }
        }

        const subscriptions: StoreKeyVal[] = []
        for (const [key, value] of values) {
            subscriptions.push({ key, value })
        }

        domain["_sendMessage"]({ kind: "domain:subscribe", values: subscriptions })
    }

    public handleUpdate(values: StoreKeyVal[]) {
        const storesToUpdate = new Set<DataStore>()
        for (const { key, value } of values) {
            if (value == null) {
                this._localReplica.delete(key)
            } else {
                this._localReplica.set(key, value)
            }

            const stores = this._subscriptions.query(key)
            for (const store of stores) {
                storesToUpdate.add(store)
            }
        }

        for (const store of storesToUpdate) {
            const key = store["_options"]!.key
            const query = key.endsWith(".*") ? key.slice(0, -2) : key
            store["_handleUpdate"](this._localReplica.get(query) as StoredValue | null)
        }
    }

    constructor(
        public readonly system: System
    ) { }
}
