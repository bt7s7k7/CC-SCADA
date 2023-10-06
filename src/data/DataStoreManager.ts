import { SubscriptionMap } from "../support/SubscriptionMap"
import { DomainProxy, StoreKeyVal } from "../system/DomainProxy"
import { System } from "../system/System"
import { DataStore, StoredValue } from "./DataStore"
import { DataStoreInitEvent } from "./DataStoreInitEvent"

export class DataStoreManager {
    protected readonly _store = new Map<string, StoredValue>()
    protected readonly _subscriptions = new SubscriptionMap<DataStore>()

    public getValue(key: string, defaultValue: StoredValue) {
        return this._store.get(key) ?? defaultValue
    }

    public handleInit(domain: DomainProxy): void {
        const init = new DataStoreInitEvent(this, domain)
        this.system.emitEvent(init, { sync: true })

        const values = new Map<string, StoredValue | null>()
        for (const store of init.stores) {
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
        for (const { key, value } of values) {
            const stores = this._subscriptions.query(key)
            for (const store of stores) {
                store["_handleUpdate"](value)
            }
        }
    }

    constructor(
        public readonly system: System
    ) { }
}
