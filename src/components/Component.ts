import { FieldType } from "../app/config"
import { Logger } from "../support/Logger"

export interface ComponentManifest {
    subComponentType: (new () => Component) | null
    fields: { name: string, type: FieldType, optional?: boolean }[]
}

export abstract class Component {
    public abstract getManifest(): ComponentManifest
    public addSubcomponent(component: Component) {
        Logger.abort(`Component cannot have sub-components`)
    }
}

const _componentTypes = new Map<string, new () => Component>()
export function registerComponent(name: string, component: new () => Component) {
    _componentTypes.set(name, component)
}

export function findComponent(name: string) {
    return _componentTypes.get(name)
}
