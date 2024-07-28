import { DataStore } from "../../data/DataStore"
import { EventLoop } from "../../support/EventLoop"
import { Logger } from "../../support/Logger"
import { DeviceFoundEvent, DeviceLostEvent } from "../../system/DeviceManager"
import { Event, EventHandler } from "../../system/Event"
import { System } from "../../system/System"
import { Component, ComponentManifest, registerComponent } from "../Component"
import { BeginTransferOperator, ExecuteTransferOperator, InputOperator, OutputOperator } from "./Logistics"

export class StorageComponent extends Component implements EventHandler {
    public name: string | null = null
    public alias: string | null = null
    public interval = 0.5
    public system = System.getSystem()

    protected _inventories = new Map<string, inventory>()
    protected _store = DataStore.of("number")
    protected _storage = new Map<string, number>()

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "name", type: "string", optional: true },
                { name: "alias", type: "string", optional: true },
                { name: "interval", type: "number", optional: true }
            ]
        }
    }

    public handleEvent(event: Event): void {
        if (event instanceof DeviceFoundEvent) {
            if (event.hasType("inventory")) this._inventories.set(event.name, event.device)
            return
        }

        if (event instanceof DeviceLostEvent) {
            this._inventories.delete(event.name)
            return
        }

        if (this.name != null) this._store.handleUpdate(event)
    }

    constructor() {
        super()
        this.system.registerEventHandler(this)

        EventLoop.setImmediate(() => {
            for (const handle of this.system.devices.getDevices()) {
                if (handle.hasType("inventory")) {
                    this._inventories.set(handle.name, handle.device)
                }
            }

            EventLoop.setInterval(null, this.interval, () => {
                EventLoop.executeAsync(() => {
                    const storage = new Map<string, number>()
                    for (const inventory of this._inventories.values()) {
                        const content = inventory.list() as any as LuaTable<number, any>
                        for (const [slot, item] of content) {
                            storage.set(item.name, item.count + (storage.get(item.name) ?? 0))
                        }
                    }

                    this._storage = storage
                    if (this.name != null) {
                        this._store.setObject(this._storage)
                    }
                })
            })

            if (this.name != null) {
                this._store.init({
                    defaultValue: 0,
                    key: this.alias ?? this.name,
                    owner: true
                })
            }
        })
    }

    protected static _instance: StorageComponent | null = null
    public static getStorage() {
        if (StorageComponent._instance == null) Logger.abort("Storage component required before being created")
        return this._instance
    }
}

registerComponent("Storage", StorageComponent)
registerComponent("BeginTransfer", BeginTransferOperator)
registerComponent("ExecuteTransfer", ExecuteTransferOperator)
registerComponent("Input", InputOperator)
registerComponent("Output", OutputOperator)
