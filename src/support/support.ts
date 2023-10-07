import { StoredValue } from "../data/DataStore"

export function autoFilter<T>(source: (T | null | false | undefined)[]) {
    return source.filter(v => v) as T[]
}

export function ensureKey<K, T>(map: [K] extends [object] ? Map<K, T> | WeakMap<K, T> : Map<K, T>, key: K, factory: () => T) {
    const existing = map.get(key)
    if (existing) return existing
    const created = factory()
    map.set(key, created)
    return created
}

export function ensureNumber(value: unknown) {
    if (typeof value == "number") return value
    if (typeof value == "string") return parseFloat(value)
    if (typeof value == "boolean") return value ? 1 : 0
    if (typeof value == "object") return (value as any[]).length
    if (value == null) return 0

    return NaN
}

export function ensureBoolean(value: unknown) {
    if (typeof value == "boolean") return value
    return ensureNumber(value) != 0
}

export function mergeObject(prefix: string, object: Map<string, StoredValue>, store: Map<string, StoredValue>, modifiedValues: Set<string>) {
    const prefixLength = prefix.length + 1
    for (const key of store.keys()) {
        if (key.startsWith(prefix + ".")) {
            const localName = key.slice(prefixLength)
            if (!object.has(localName)) {
                store.delete(key)
                modifiedValues.add(key)
            }
        }
    }

    for (const [localName, value] of object) {
        const key = prefix + "." + localName
        const existing = store.get(key)
        if (existing != value) {
            modifiedValues.add(key)
            store.set(key, value)
        }
    }

    modifiedValues.add(prefix)
    store.set(prefix, object.size)
}
