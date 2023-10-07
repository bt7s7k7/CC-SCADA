import { EventLoop, ListenerHandle } from "../support/EventLoop"
import { Logger } from "../support/Logger"
import { Event } from "./Event"
import { System } from "./System"

export class DeviceFoundEvent extends Event {
    public getTypes() {
        return peripheral.getType(this.device).join(" | ")
    }

    public hasType<K extends keyof PeripheralMap>(type: K): this is { device: PeripheralMap[K] } {
        return peripheral.hasType(this.device, type) ?? false
    }

    constructor(
        public readonly name: string,
        public readonly device: object
    ) { super("DeviceFoundEvent") }
}

export class DeviceLostEvent extends Event {
    constructor(
        public readonly name: string
    ) { super("DeviceLostEvent") }
}

export class DeviceManager {
    protected readonly _devices = new Map<string, object>()

    public *getDevices() {
        for (const [name, device] of this._devices) {
            yield new DeviceFoundEvent(name, device)
        }
    }

    public getDevice(name: string) {
        const device = this._devices.get(name)
        if (device == null) Logger.abort(`Cannot get device "${name}"`)
        return device
    }

    public tryGetDevice(name: string) {
        const device = this._devices.get(name)
        return device as object | null
    }

    public hasType<K extends keyof PeripheralMap>(device: object | null, type: K): device is PeripheralMap[K] {
        if (device == null) return false
        return peripheral.hasType(device, type) ?? false
    }

    protected _addDevice(name: string, device: object) {
        // Sometimes a peripheral event is raised event though the peripheral was already in getNames()
        if (this._devices.has(name)) return
        this._devices.set(name, device)
        this._system.emitEvent(new DeviceFoundEvent(name, device))
    }

    protected _removeDevice(name: string) {
        this._devices.delete(name)
        this._system.emitEvent(new DeviceLostEvent(name))
    }

    constructor(
        protected readonly _system: System
    ) {
        for (const name of peripheral.getNames()) {
            const handle = peripheral.wrap(name)
            if (handle == null) Logger.abort(`Peripheral "${name}" is fake`)

            this._addDevice(name, handle)
        }

        const listener = new ListenerHandle()
        EventLoop.subscribe(listener, "peripheral", (event) => {
            const name = event["1"]
            const handle = peripheral.wrap(name)
            if (handle == null) Logger.abort(`Peripheral "${name}" is fake`)
            this._addDevice(name, handle)
        })

        EventLoop.subscribe(listener, "peripheral_detach", (event) => {
            const name = event["1"]
            this._removeDevice(name)
        })
    }
}
