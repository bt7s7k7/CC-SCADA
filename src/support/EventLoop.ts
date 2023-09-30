let _iteration: (() => void)[] = []
interface Subscription<K extends keyof EventMap = any> {
    event: K
    listener: (event: EventMap[K], handle: ListenerHandle) => void
    match?: Partial<EventMap[K]>
    once: boolean
    handle: ListenerHandle
}

const _subscriptions = new Map<keyof EventMap, Subscription[]>()

export class ListenerHandle {
    protected _subscriptions: Subscription[] = []
    protected _guards: (() => void)[] = []

    public dispose() {
        for (const subscription of this._subscriptions) {
            const collection = _subscriptions.get(subscription.event)!
            const index = collection.indexOf(subscription)
            collection.splice(index, 1)
        }

        for (const guard of this._guards) {
            guard()
        }
    }
}

export namespace EventLoop {
    export function subscribe<K extends keyof EventMap>(handle: ListenerHandle | null, event: K, listener: Subscription<K>["listener"], options?: { match?: Partial<EventMap[K]>, once?: boolean }) {
        let collection = _subscriptions.get(event)
        if (collection == null) {
            collection = []
            _subscriptions.set(event, collection)
        }

        handle ??= new ListenerHandle()

        const subscription: Subscription<K> = {
            event, listener, handle,
            once: options?.once ?? false,
            match: options?.match,
        }

        collection.push(subscription)
        handle["_subscriptions"].push(subscription)

        return handle
    }

    export function run() {
        for (; ;) {
            while (_iteration.length > 0) {
                const swap = _iteration
                _iteration = []
                for (const callback of swap) {
                    callback()
                }
            }

            const event = os.pullEvent()
            const eventName = event[0]
            const eventData: Record<string, any> = {}
            for (let i = 0; i < event.length; i++) {
                eventData[i.toString()] = event[i]
            }

            const subscriptions = _subscriptions.get(eventName as keyof EventMap)
            if (subscriptions != null) {
                const once = new ListenerHandle()

                for (const subscription of subscriptions) {
                    let skip = false
                    if (subscription.match) {
                        for (const [key, value] of Object.entries(subscription.match)) {
                            if (eventData[key] != value) skip = true
                        }
                    }

                    if (!skip) {
                        subscription.listener(eventData, subscription.handle)
                    }
                }

                once.dispose()
            }
        }
    }

    export function setImmediate(callback: () => void) {
        _iteration.push(callback)
    }

    export function setTimeout(handle: ListenerHandle | null, time: number, callback: (handle: ListenerHandle) => void) {
        const id = os.startTimer(time)
        handle ??= new ListenerHandle()
        handle["_guards"].push(() => os.cancelTimer(id))

        subscribe(handle, "timer", (_, handle) => callback(handle), {
            once: true,
            match: { "1": id }
        })

        return handle
    }

    export function setInterval(handle: ListenerHandle | null, time: number, callback: (handle: ListenerHandle) => void) {
        let id = os.startTimer(time)
        handle ??= new ListenerHandle()
        handle["_guards"].push(() => os.cancelTimer(id))

        let collection = _subscriptions.get("timer")
        if (collection == null) {
            collection = []
            _subscriptions.set("timer", collection)
        }

        const subscription: Subscription<"timer"> = {
            event: "timer",
            listener(event, handle) {
                id = os.startTimer(time)
                subscription.match!["1"] = id
                callback(handle)
            },
            once: false, handle,
            match: { "1": id }
        }

        collection.push(subscription)
        handle["_subscriptions"].push(subscription)

        return handle
    }
}
