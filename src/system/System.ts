import { Component, ComponentManifest, registerComponent } from "../components/Component"
import { EventLoop } from "../support/EventLoop"
import { Logger } from "../support/Logger"
import { DeviceManager } from "./DeviceManager"
import { DomainProxy } from "./DomainProxy"
import { Event, EventHandler } from "./Event"

export class System extends Component {
    protected _eventHandlers: EventHandler[] = []
    protected _domainProxy: DomainProxy | null = null

    public readonly name = ""
    public readonly domain: string | null = null
    public readonly connectionModem: string | null = null

    public readonly devices = new DeviceManager(this)

    public getManifest(): ComponentManifest {
        return {
            subComponentType: null,
            fields: [
                { name: "name", type: "string" },
                { name: "domain", type: "string", optional: true },
                { name: "connectionModem", type: "string", optional: true }
            ]
        }
    }

    public registerEventHandler(handler: EventHandler) {
        this._eventHandlers.push(handler)
    }

    public emitEvent(event: Event, { sync = false } = {}) {
        if (sync) {
            for (const handler of this._eventHandlers) {
                handler.handleEvent(event)
            }

            return
        }

        EventLoop.setImmediate(() => {
            this.emitEvent(event, { sync: true })
        })
    }

    constructor() {
        super()
        if (System._instance != null) Logger.abort(`Can only create one instance of System component`)
        System._instance = this
    }

    protected static _instance: System | null = null
    public static getSystem() {
        if (System._instance == null) {
            Logger.abort("Created a component before System")
        }

        return System._instance
    }
}

registerComponent("System", System)