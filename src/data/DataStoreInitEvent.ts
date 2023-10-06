import { DomainProxy, StoreKeyVal } from "../system/DomainProxy"
import { Event } from "../system/Event"
import { DataStore, StoredValue } from "./DataStore"
import { DataStoreManager } from "./DataStoreManager"


export class DataStoreInitEvent extends Event {
    public readonly stores: DataStore[] = []

    public update(key: string, value: StoredValue | null) {
        this.domain["_sendMessage"]({ kind: "domain:update", values: [{ key, value }] })
    }

    public updateMany(values: StoreKeyVal[]) {
        this.domain["_sendMessage"]({ kind: "domain:update", values })
    }

    constructor(
        public readonly manager: DataStoreManager,
        public readonly domain: DomainProxy
    ) {
        super("DataStoreInitEvent")
    }
}
