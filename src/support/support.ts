export function autoFilter<T>(source: (T | null | false | undefined)[]) {
    return source.filter(v => v) as T[]
}
