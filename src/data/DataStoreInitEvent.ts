import { DomainProxy, StoreKeyVal } from "../system/DomainProxy"
import { Event } from "../system/Event"
import { DataStore, StoredValue } from "./DataStore"
import { DataStoreManager } from "./DataStoreManager"


export class DataStoreInitEvent extends Event {
    public readonly stores: DataStore[] = []

    constructor(
        public readonly manager: DataStoreManager,
        public readonly domain: DomainProxy
    ) {
        super("DataStoreInitEvent")
    }
}
