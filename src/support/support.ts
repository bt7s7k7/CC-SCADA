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
