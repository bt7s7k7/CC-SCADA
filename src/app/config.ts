import { Component, ComponentManifest, findComponent } from "../components/Component"
import { Logger } from "../support/Logger"

export type FieldType = "string" | "number" | "boolean" | "rid" | "int"
function parseField(type: FieldType, text: string) {
    if (type == "string") return text
    if (type == "boolean") {
        if (text == "true") return true
        if (text == "false") return false
        Logger.printError("Invalid value for boolean, only accepts true or false")
        return null
    }
    if (type == "number") {
        const value = parseFloat(text)
        if (isNaN(value)) {
            Logger.printError("Invalid number")
            return null
        }
        return value
    }
    if (type == "int") {
        const value = parseInt(text)
        if (isNaN(value)) {
            Logger.printError("Invalid number")
            return null
        }
        return value
    }
    if (type == "rid") {
        Logger.printError("RID type is not implemented yet")
        return null
    }
    Logger.printError("Internal parser error, invalid field type set")
    return null
}

export function parseConfig(config: io.Handle) {
    let component: Component | null = null
    let manifest: ComponentManifest | null = null
    const defined = new Set<string>()
    let lineNum = 1

    const components: Component[] = []

    function parseLine(line: string) {
        if (line == "") return
        if (line[0] == "#") return

        if (component == null) {
            const name = line.slice(1)
            const ctor = findComponent(name)
            if (ctor == null) {
                Logger.abort(`Cannot find component named "${name}" at line ${lineNum}`)
            }
            component = new ctor()
            components.push(component)
            return
        }

        if (line == "end") {
            manifest ??= component.getManifest()

            const missing = manifest.fields.filter(v => !v.optional).map((v, i) => ({ name: v.name, index: i })).filter(v => !defined.has(v.name))
            if (missing.length > 0) {
                Logger.abort(`Missing fields: ${missing.map(v => `"${v.name}"`).join(", ")} at line ${lineNum}`)
            }

            defined.clear()
            component = null
            manifest = null
            return
        }

        if (line[0].toUpperCase() == line[0]) {
            manifest ??= component.getManifest()
            if (manifest.subComponentType == null) {
                Logger.abort(`Component does not accept sub-components at line ${lineNum}`)
            }

            let nameEnd = line.indexOf(" ")
            if (nameEnd == -1) nameEnd = line.length
            const name = line.slice(0, nameEnd)
            const ctor = findComponent(name)
            if (ctor == null) {
                Logger.abort(`Cannot find component named "${name}" at line ${lineNum}`)
            }
            const child = new ctor()
            if (!(child instanceof manifest.subComponentType)) {
                Logger.abort(`Sub-component is not of allowed type at line ${lineNum}`)
            }

            const childManifest = child.getManifest()
            const args = line.slice(nameEnd).split(",").map(v => v.trim())
            const defined = new Set<string>()

            if (args.length == 1 && args[0] == "") {
                if (childManifest.fields.length > 0 && childManifest.fields[0].type == "string") {
                    const field = childManifest.fields[0];
                    (child as any)[field.name] = ""
                    defined.add(field.name)
                }
            } else {
                if (args.length > childManifest.fields.length) {
                    Logger.abort(`Too many arguments (${args.length} > ${childManifest.fields.length}) at line ${lineNum}`)
                }

                for (let i = 0; i < args.length; i++) {
                    const arg = args[i]
                    const field = childManifest.fields[i]
                    const value = parseField(field.type, arg)
                    if (value == null) {
                        Logger.abort(`Cannot parse argument ${i} of type "${field.type}" at line ${lineNum}`)
                    }
                    (child as any)[field.name] = value
                    defined.add(field.name)
                }
            }

            const missing = childManifest.fields.filter(v => !v.optional).map((v, i) => ({ name: v.name, index: i })).filter(v => !defined.has(v.name))
            if (missing.length > 0) {
                Logger.abort(`Missing arguments: ${missing.map(v => `"${v.name}"`).join(", ")} at line ${lineNum}`)
            }

            component.addSubcomponent(child)

            return
        }

        const nameEnd = line.indexOf(":")
        if (nameEnd == -1) {
            Logger.abort(`Missing colon for field name delimiter at line ${lineNum}`)
        }
        const name = line.slice(0, nameEnd)
        manifest ??= component.getManifest()
        const field = manifest.fields.find(v => v.name == name)
        if (field == null) {
            Logger.abort(`Unknown field name "${name}" at ${lineNum}`)
        }

        if (defined.has(name)) {
            Logger.abort(`Duplicate field name "${name}" at ${lineNum}`)
        }

        const value = parseField(field.type, line.slice(nameEnd + 1).trim())
        if (value == null) {
            Logger.abort(`Cannot parse field "${name}" of type "${field.type}" value at line ${lineNum}`)
        }
        (component as any)[field.name] = value
        defined.add(field.name)
    }

    for (const line of config.lines()) {
        parseLine(line.trim())
        lineNum++
    }

    return components
}
