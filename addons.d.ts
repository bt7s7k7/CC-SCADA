/** @noSelfInFile */

declare namespace periphemu {
    export function create(side: string, type: string, path?: string): boolean
    export function remove(side: string): boolean
}

interface redrouter {
    /** @noSelf */
    setOutput(side: string, on: boolean): void
    /** @noSelf */
    getOutput(side: string): boolean
    /** @noSelf */
    getInput(side: string): boolean
    /** @noSelf */
    setAnalogOutput(side: string, value: number): void
    /** @noSelf */
    getAnalogOutput(side: string): number
    /** @noSelf */
    getAnalogInput(side: string): number
}

interface PeripheralMap {
    "redrouter": redrouter
}
