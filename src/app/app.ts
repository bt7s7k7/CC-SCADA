// eslint-disable-next-line no-console
/// <reference path="../../cc-tweaked.d.ts" />
/// <reference path="../../addons.d.ts" />

import "../components/compute/Compute"
import "../components/logistics/Storage"
import "../components/monitor/Monitor"
import { Drawer, getStyleList } from "../drawing/Drawer"
import { Widget } from "../drawing/Widget"
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

const args = [...$vararg]

try {
    if (args.length == 1 && args[0] != "app.app") {
        const command = args[0]
        if (command == "help") {
            Logger.printWork("Usage: cc-scada.lua [command]")
            Logger.printWork("  :: Run without commands to start the runtime")
            Logger.printWork("  help: Print command list")
            Logger.printWork("  ui-test: Show the UI test screen")
            Logger.printWork("  async-test: Execute the async task test")
        } else if (command == "ui-test") {
            const drawer = new Drawer(term)

            const root = new Widget({
                style: "secondary",
                axis: "column",
                content: [
                    new Widget({ content: " Styles:" }),
                    new Widget({
                        content: getStyleList().map(style => new Widget({ content: style, style }))
                    }),
                    new Widget({ content: " Wrap:" }),
                    new Widget({
                        overflow: "wrap",
                        content: Array.from({ length: 50 }, (_, i) => new Widget({
                            content: i.toString().repeat(5) + " ",
                            style: i % 2 == 0 ? "output" : "secondary"
                        }))
                    }),
                    new Widget({ content: " Hide:" }),
                    new Widget({
                        overflow: "hide",
                        content: Array.from({ length: 50 }, (_, i) => new Widget({
                            content: i.toString().repeat(5) + " ",
                            style: i % 2 == 0 ? "output" : "secondary"
                        }))
                    })
                ]
            })
            Widget.calculateLayout(root, drawer.size)
            Widget.draw(root, drawer)

            EventLoop.run()
        } else if (command == "async-test") {
            EventLoop.subscribe(null, "key", (event) => {
                Logger.printWork(event["1"])
            })

            const [width, height] = term.getSize()
            let x = 1, y = height
            let oX = 0, oY = 0
            const task = EventLoop.executeAsync(() => {
                const value = read()
                Logger.abort(value)
            })

            task.before = () => {
                [oX, oY] = term.getCursorPos()
                term.setCursorPos(x, y)
            }

            task.after = () => {
                [x, y] = term.getCursorPos()
                term.setCursorPos(oX, oY)
            }

            EventLoop.run()
        } else {
            Logger.abort(`Unknown command, use the "help" command`)
        }
    } else if (args.length <= 1) {
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

        const configFile = io.open("config.txt", "r")
        if (configFile == null) {
            Logger.printWork(`No config file found, creating blank.`)
            const config = io.open("config.txt", "w")
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
    } else {
        Logger.abort(`Expected 0 or 1 argument, use argument "help" to view commands`)
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
