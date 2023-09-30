/** @noSelfInFile */

declare namespace periphemu {
    export function create(side: string, type: string, path?: string): boolean
    export function remove(side: string): boolean
}
