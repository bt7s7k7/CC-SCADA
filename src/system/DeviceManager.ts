import { EventLoop, ListenerHandle } from "../support/EventLoop"
import { Logger } from "../support/Logger"
import { DeviceFoundEvent, DeviceLostEvent } from "./DevicesManager"
import { System } from "./System"


export class DeviceManager {
    public readonly devices = new Map<string, object>();

    public *getDevices() {
        for (const [name, device] of this.devices) {
            yield new DeviceFoundEvent(name, device)
        }
    }

    public getDevice(name: string) {
        const device = this.devices.get(name)
        if (device == null) Logger.abort("Cannot get device " + name)
        return device
    }

    protected _addDevice(name: string, device: object) {
        // Sometimes a peripheral event is raised event though the peripheral was already in getNames()
        if (this.devices.has(name)) return
        this.devices.set(name, device)
        this._system.emitEvent(new DeviceFoundEvent(name, device))
    }

    protected _removeDevice(name: string) {
        this.devices.delete(name)
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
