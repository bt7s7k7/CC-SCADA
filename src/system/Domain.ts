import { EventLoop, ListenerHandle } from "../support/EventLoop"
import { Logger } from "../support/Logger"
import { ClientMessage, DomainMessage } from "./DomainProxy"
import { System } from "./System"

export const DOMAIN_DISCOVERY_CHANNEL = 65433

class ClientHandle {
    public receivedPing = true

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly nonce: number
    ) { }
}

export class Domain {
    protected readonly _computerID = os.getComputerID()
    protected readonly _listener = new ListenerHandle()
    protected readonly _clients = new Map<number, ClientHandle>()
    protected readonly _clientLookup = new Map<string, ClientHandle>()
    protected readonly _modem

    public handleMessage(id: number, msg: DomainMessage) {
        if (msg.kind == "domain:login") {
            const duplicate = this._clients.get(id)
            const client = new ClientHandle(id, msg.name, msg.nonce)
            if (duplicate) {
                if (duplicate.nonce == client.nonce) {
                    return
                } else {
                    this._removeClient(duplicate)
                }
            }

            const nameDuplicate = this._clientLookup.get(client.name)
            if (nameDuplicate) {
                this._sendMessage(id, { kind: "client:login-deny", nonce: client.nonce, reason: "Duplicate name" })
            } else {
                this._clients.set(id, client)
                this._clientLookup.set(client.name, client)
                Logger.printOK(`New client "${client.name}" at ${client.id}`)
                this._sendMessage(id, { kind: "client:login-accept", nonce: client.nonce })
            }
            return
        }

        const client = this._clients.get(id)
        if (client == null) return

        if (msg.kind == "domain:ping") {
            this._sendMessage(id, { kind: "client:pong" })
            return
        }

        if (msg.kind == "domain:pong") {
            client.receivedPing = true
            return
        }
    }

    protected _sendMessage(id: number, msg: ClientMessage) {
        if (id == this._computerID) {
            this.messageListener?.(msg)
        } else {
            this._modem?.transmit(id, this._computerID, msg)
        }
    }

    protected _removeClient(client: ClientHandle) {
        Logger.printOK(`Timeout client "${client.name}" at ${client.id}`)
        this._clients.delete(client.id)
        this._clientLookup.delete(client.name)
    }

    constructor(
        public readonly system: System,
        public readonly messageListener?: (msg: ClientMessage) => void
    ) {

        const connectionModem = system.connectionModem
        if (connectionModem != null) {
            this._modem = system.devices.getDevice(connectionModem) as modem
            if (!peripheral.hasType(this._modem, "modem")) Logger.abort(`Connection modem setting "${connectionModem}" does not point to a modem`)

            this._modem.open(this._computerID)
            this._modem.open(DOMAIN_DISCOVERY_CHANNEL)

            EventLoop.subscribe(this._listener, "modem_message", (event) => {
                const modemName = event["1"]
                const channel = event["2"]
                const clientID = event["3"]
                const payload = event["4"]

                if (
                    channel == this._computerID || channel == DOMAIN_DISCOVERY_CHANNEL &&
                    modemName == connectionModem &&
                    payload != null &&
                    typeof payload == "object"
                ) {
                    const msg = payload as DomainMessage
                    this.handleMessage(clientID, msg)
                }
            })


            EventLoop.setInterval(this._listener, 1, () => {
                for (const client of this._clients.values()) {
                    if (client.id != this._computerID) {
                        this._sendMessage(client.id, { kind: "client:ping" })
                    }
                }
            })

            EventLoop.setInterval(this._listener, 2, () => {
                for (const client of this._clients.values()) {
                    if (client.receivedPing == false) {
                        this._removeClient(client)
                    }
                }
            })
        }
    }
}
