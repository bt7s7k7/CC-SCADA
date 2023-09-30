import { EventLoop, ListenerHandle } from "../support/EventLoop"
import { Logger } from "../support/Logger"
import { DOMAIN_DISCOVERY_CHANNEL, Domain } from "./Domain"
import { Event } from "./Event"
import { System } from "./System"

export type DomainMessage = (
    | { kind: "domain:ping" }
    | { kind: "domain:pong" }
    | { kind: "domain:login", name: string, nonce: number, domain: string }
)

export type ClientMessage = (
    | { kind: "client:ping" }
    | { kind: "client:pong" }
    | { kind: "client:login-accept", nonce: number }
    | { kind: "client:login-deny", nonce: number, reason: string }
)

export class DomainAcquiredEvent extends Event {
    constructor(
        public readonly domain: DomainProxy
    ) { super("DomainAcquiredEvent") }
}

export class DomainLostEvent extends Event {
    constructor() { super("DomainLostEvent") }
}

export abstract class DomainProxy {

    protected abstract _sendMessage(msg: DomainMessage): void
    protected _receiveMessage(msg: ClientMessage) {
        if (msg.kind == "client:ping") {
            this._sendMessage({ kind: "domain:pong" })
        }
    }

    public static findDomain(domainName: string | null) {
        const system = System.getSystem()

        if (domainName == null) {
            system.emitEvent(new DomainAcquiredEvent(new LocalDomain(system)))
            return
        }

        const nonce = os.epoch()
        const computerID = os.getComputerID()
        const name = system.name
        const listener = new ListenerHandle()

        const sendRequest = () => {
            const modems: modem[] = []
            for (const handle of system.devices.getDevices()) {
                if (handle.hasType("modem")) {
                    modems.push(handle.device)
                }
            }

            for (const modem of modems) {
                if (!modem.isOpen(computerID)) {
                    modem.open(computerID)
                }

                modem.transmit(DOMAIN_DISCOVERY_CHANNEL, computerID, {
                    kind: "domain:login", nonce, name,
                    domain: domainName
                } satisfies DomainMessage)
            }
        }

        EventLoop.subscribe(listener, "modem_message", (event) => {
            const modemName = event["1"]
            const channel = event["2"]
            const domainID = event["3"]
            const payload = event["4"]

            if (channel == computerID && payload != null && typeof payload == "object") {
                const msg = payload as ClientMessage
                if (msg.kind == "client:login-accept" && msg.nonce == nonce) {
                    listener.dispose()
                    const modem = system.devices.getDevice(modemName) as modem
                    const proxy = new RemoteDomain(system, modemName, modem, domainID)
                    system.emitEvent(new DomainAcquiredEvent(proxy))
                }

                if (msg.kind == "client:login-deny" && msg.nonce == nonce) {
                    Logger.abort("Domain login denied: " + msg.reason)
                }
            }
        })

        sendRequest()
        EventLoop.setInterval(listener, 1, () => {
            Logger.printWork(`No response, searching again...`)
            sendRequest()
        })

    }

    constructor(
        public readonly system: System
    ) { }
}

class LocalDomain extends DomainProxy {
    protected readonly _computerID = os.getComputerID()

    protected _domain = new Domain(this.system, (msg) => {
        this._receiveMessage(msg)
    })

    protected _sendMessage(msg: DomainMessage): void {
        this._domain.handleMessage(this._computerID, msg)
    }
}

class RemoteDomain extends DomainProxy {
    protected readonly _listener = new ListenerHandle()
    protected readonly _computerID = os.getComputerID()

    protected _sendMessage(msg: DomainMessage): void {
        this.modem.transmit(this.domainID, this._computerID, msg)
    }

    constructor(
        system: System,
        public readonly modemName: string,
        public readonly modem: modem,
        public readonly domainID: number
    ) {
        super(system)

        let receivedPing = true

        EventLoop.subscribe(this._listener, "modem_message", (event) => {
            const modemName = event["1"]
            const channel = event["2"]
            const domainID = event["3"]
            const payload = event["4"]

            if (
                channel == this._computerID &&
                modemName == this.modemName &&
                domainID == this.domainID &&
                payload != null &&
                typeof payload == "object"
            ) {
                const msg = payload as ClientMessage
                if (msg.kind == "client:pong") {
                    receivedPing = true
                } else {
                    this._receiveMessage(msg)
                }
            }
        })

        EventLoop.setInterval(this._listener, 1, () => {
            this._sendMessage({ kind: "domain:ping" })
        })

        EventLoop.setInterval(this._listener, 2, () => {
            if (receivedPing == false) {
                this._listener.dispose()
                Logger.printError(`Domain connection timeout`)
                this.system.emitEvent(new DomainLostEvent())
                return
            }

            receivedPing = false
        })
    }
}


