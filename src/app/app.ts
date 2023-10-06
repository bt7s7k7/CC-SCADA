// eslint-disable-next-line no-console
/// <reference path="../../cc-tweaked.d.ts" />
/// <reference path="../../craftos.d.ts" />

import "../components/monitor/Monitor"
import { EventLoop } from "../support/EventLoop"
import { Logger } from "../support/Logger"
import { DeviceFoundEvent, DeviceLostEvent } from "../system/DeviceManager"
import { DomainAcquiredEvent, DomainLostEvent, DomainProxy } from "../system/DomainProxy"
import { Event, EventHandler } from "../system/Event"
import { System } from "../system/System"
import { parseConfig } from "./config"

declare global {
    const version: string
    /** @noSelf */
    function exit(): never

    /** @noSelf */
    function pcall(thunk: () => void): LuaMultiReturn<[status: boolean, err: string]>
}

try {
    print("------")

    if (fs.exists("out.log")) {
        if (fs.exists("out.log.bak")) fs.delete("out.log.bak")
        fs.move("out.log", "out.log.bak")
    }
    const logFile = io.open("out.log", "w")
    if (logFile == null) {
        Logger.abort("Cannot open log file")
    }
    Logger.setLogFile(logFile)

    Logger.printWork(`Initializing CC-SCADA v${version}...`)
    Logger.printWork(`Loading config...`)

    const configFile = io.open("cc-scada.txt", "r")
    if (configFile == null) {
        Logger.printWork(`No config file found, creating blank.`)
        const config = io.open("cc-scada.txt", "w")
        config.write([
            "@System",
            "name: worker",
            "end",
            ""
        ].join("\n"))
        config.close()
    } else {
        parseConfig(configFile)

        const system = System.getSystem()
        Logger.printOK(`System name: ${system.name}`)
        Logger.printOK(`Domain: ${system.domain}`)

        os.setComputerLabel(system.name)

        system.registerEventHandler(new class implements EventHandler {
            public handleEvent(event: Event): void {
                if (event instanceof DomainAcquiredEvent) {
                    Logger.printOK("Acquired domain")
                } else if (event instanceof DomainLostEvent) {
                    Logger.printWork("Domain lost, searching...")
                    DomainProxy.findDomain(system.domain)
                } else if (event instanceof DeviceFoundEvent) {
                    Logger.printOK(`Found device "${event.getTypes()}" at "${event.name}"`)
                } else if (event instanceof DeviceLostEvent) {
                    Logger.printOK(`Lost device at "${event.name}"`)
                }
            }
        })


        EventLoop.queueMicrotask(() => {
            if (system.domain == null) {
                Logger.printWork("Creating local domain...")
            } else {
                Logger.printWork("Searching for domain...")
            }

            DomainProxy.findDomain(system.domain)
        })
        EventLoop.run()
    }
} catch (err: any) {
    if (typeof err == "object") {
        if (err.message != "abort") {
            Logger.abort(err.stack)
        }
    } else {
        Logger.abort(err)
    }
}
