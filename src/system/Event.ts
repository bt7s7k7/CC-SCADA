export abstract class Event {
    constructor(
        public readonly name: string
    ) { }
}

export interface EventHandler {
    handleEvent(event: Event): void
}

