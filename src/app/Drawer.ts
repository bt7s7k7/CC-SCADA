export class Drawer {

    public setBlink(blink: boolean) {
        this.ctx.setCursorBlink(blink)
        return this
    }

    constructor(
        public readonly ctx: term.Redirect
    ) {
        this.setBlink(false)
    }
}
