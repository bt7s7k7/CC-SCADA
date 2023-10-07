import { PING_INTERVAL, TIMEOUT_DURATION } from "../constants"
import { StoredValue } from "../data/DataStore"
import { EventLoop, ListenerHandle } from "../support/EventLoop"
import { Logger } from "../support/Logger"
import { SubscriptionMap } from "../support/SubscriptionMap"
import { ensureKey } from "../support/support"
import { ClientMessage, DomainMessage, StoreKeyVal } from "./DomainProxy"
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
    protected readonly _store = new Map<string, StoredValue>()
    protected readonly _subscriptions = new SubscriptionMap<ClientHandle>()

    public handleMessage(id: number, msg: DomainMessage) {
        // Logger.debug("<-", id, textutils.serialiseJSON(msg))
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
                this._updateDomainInfo()
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

        if (msg.kind == "domain:subscribe") {
            const transaction = this._createTransaction()

            for (const { key, value } of msg.values) {
                this._subscriptions.subscribe(client, key)
                if (value != null && !this._store.has(key)) {
                    transaction.updateValue(key, value)
                } else {
                    transaction.initValue(client, key)
                }
            }

            transaction.finish()
            this._saveDatabase()
            return
        }

        if (msg.kind == "domain:update") {
            const transaction = this._createTransaction()

            for (const { key, value } of msg.values) {
                transaction.updateValue(key, value)
            }

            transaction.finish()
            this._saveDatabase()
            return
        }
    }

    protected _createTransaction() {
        const modifiedValues = new Set<string>()
        const clientInit: { client: ClientHandle, key: string }[] = []

        return {
            updateValue: (key: string, value: StoredValue | null) => {
                const prev = this._store.get(key)
                if (prev == value) return
                modifiedValues.add(key)
                if (value == null) {
                    this._store.delete(key)
                } else {
                    this._store.set(key, value)
                }
            },
            initValue: (client: ClientHandle, key: string) => {
                clientInit.push({ client, key })
            },
            finish: () => {
                if (modifiedValues.size == 0 && clientInit.length == 0) return
                const clientUpdates = new Map<ClientHandle, Map<string, StoredValue | null>>()

                for (const key of modifiedValues) {
                    const value = this._store.get(key)
                    const updatedClients = this._subscriptions.query(key)

                    for (const client of updatedClients) {
                        ensureKey(clientUpdates, client, () => new Map<never, never>()).set(key, value as StoredValue | null)
                    }
                }

                for (const { key, client } of clientInit) {
                    const value = this._store.get(key)
                    ensureKey(clientUpdates, client, () => new Map<never, never>()).set(key, value as StoredValue | null)
                }

                for (const [client, updates] of clientUpdates) {
                    const values: StoreKeyVal[] = []
                    for (const [key, value] of updates) {
                        values.push({ key, value })
                    }

                    this._sendMessage(client.id, { kind: "client:update", values })
                }
            }
        }
    }

    protected _updateDomainInfo() {
        const transaction = this._createTransaction()
        transaction.updateValue("domain.clients", [...this._clientLookup.keys()])
        transaction.finish()
    }

    protected _sendMessage(id: number, msg: ClientMessage) {
        // Logger.debug("->", id, textutils.serialiseJSON(msg))
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
        this._subscriptions.remove(client)
        this._updateDomainInfo()
    }

    protected _saveDatabase() {
        const data: Record<string, any> = {}
        for (const [key, value] of this._store) {
            if (!key.startsWith("domain.")) {
                data[key] = value
            }
        }

        const database = io.open("/database.json", "w")
        database.write(textutils.serialiseJSON(data))
        database.close()
    }

    constructor(
        public readonly system: System,
        public readonly messageListener?: (msg: ClientMessage) => void
    ) {
        if (fs.exists("/database.json")) {
            const file = io.open("/database.json", "r")
            const [content] = file.read("a")
            if (content == null) Logger.abort("Failed to read the database file")
            const data = textutils.unserialiseJSON(content)
            if (data != null) {
                for (const [key, value] of Object.entries(data)) {
                    this._store.set(key as string, value as string)
                }
            } else {
                Logger.printError("Cannot parse database file")
            }
            file.close()
            if (fs.exists("/database.bak.json")) fs.delete("/database.bak.json")
            fs.move("/database.json", "/database.bak.json")
        }

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


            EventLoop.setInterval(this._listener, PING_INTERVAL, () => {
                for (const client of this._clients.values()) {
                    if (client.id != this._computerID) {
                        this._sendMessage(client.id, { kind: "client:ping" })
                    }
                }
            })

            EventLoop.setInterval(this._listener, TIMEOUT_DURATION, () => {
                for (const client of this._clients.values()) {
                    if (client.id != this._computerID && client.receivedPing == false) {
                        this._removeClient(client)
                    }

                    client.receivedPing = false
                }
            })
        }
    }
}
