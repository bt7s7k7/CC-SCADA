import { Logger } from "./Logger"
import { ensureKey } from "./support"

export class SubscriptionMap<T> {
    protected _store = new Map<string, Set<T>>()
    protected _reverse = new Map<T, string[]>()

    public subscribe(client: T, query: string) {
        ensureKey(this._store, query, () => new Set()).add(client)
        ensureKey(this._reverse, client, () => []).push(query)
    }

    public remove(client: T) {
        const subscriptions = this._reverse.get(client)
        if (subscriptions == null) return

        for (const query of subscriptions) {
            const collection = this._store.get(query) ?? Logger.abort(`HierarchialMap.ts:15`)
            collection.delete(client)
            if (collection.size == 0) this._store.delete(query)
        }

        this._reverse.delete(client)
    }

    public query(query: string) {
        const updated = new Set<T>()

        const test = (query: string) => {
            const result = this._store.get(query)
            if (result == null) return
            for (const client of result) updated.add(client)
        }

        test("*")
        test(query)

        let subKey = ""
        for (const segment of query.split(".")) {
            if (subKey != "") subKey += "." + segment
            else subKey = segment
            test(subKey + ".*")
        }

        return updated
    }
}
