let _stdoutEnabled = true
let _logFile: io.Handle | null = null

/** @noSelf */
declare function tostring(value: any): string

function logPrint(prefix: string | null, color: number, values: any[]) {
    const msg = values.map(v => tostring(v)).join(" ")
    if (_stdoutEnabled) {
        if (prefix != null) {
            term.write("[")
            if (term.isColor()) {
                term.setTextColor(color)
            } else {
                term.setTextColor(colors.lightGray)
            }
            term.write(prefix)
            term.setTextColor(colors.white)
            term.write("] ")
        }

        print(msg)
    }

    if (_logFile) {
        if (prefix != null) _logFile.write(`[${prefix}] `)
        _logFile.write(msg + "\n")
        _logFile.flush()
    }
}

declare const debug: {
    /** @noSelf */
    traceback(): string
}
function performTrace() {
    return debug.traceback()
}

export namespace Logger {
    export function setLogFile(file: io.Handle) {
        _logFile = file
    }

    export function stopStdout() {
        _stdoutEnabled = false
    }

    export function printWork(...values: any[]) {
        logPrint(null, 0, values)
    }

    export function printOK(...values: any[]) {
        logPrint("OK", colors.lime, values)
    }

    export function printError(...values: any[]) {
        logPrint("ERR", colors.red, values)
    }

    export function debug(...values: any[]) {
        logPrint("!!", colors.purple, values)
    }

    export function abort(...values: any[]): never {
        const msg = values.map(v => tostring(v)).join(" ")
        const stack = performTrace()
        logPrint("ABORT", colors.red, [msg + "\n" + stack])
        throw new Error("abort")
    }
}
