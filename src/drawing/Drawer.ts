import { Logger } from "../support/Logger"
import { Point } from "./Point"

export type Style = "primary" | "secondary" | "error" | "success" | "output" | "grey"
const COLOR_PALETTE: Record<Style, [bg: number, fg: number]> = {
    primary: [colors.blue, colors.white],
    secondary: [colors.gray, colors.white],
    error: [colors.red, colors.white],
    success: [colors.green, colors.white],
    output: [colors.gray, colors.yellow],
    grey: [colors.lightGray, colors.black]
}

const MONO_PALETTE: Record<Style, [bg: number, fg: number]> = {
    primary: [colors.white, colors.black],
    error: [colors.white, colors.black],
    success: [colors.white, colors.black],
    secondary: [colors.black, colors.white],
    output: [colors.black, colors.lightGray],
    grey: [colors.gray, colors.black]
}

export class Drawer {
    public readonly isColor = this.ctx.isColor()
    public readonly size

    public setBlink(blink: boolean) {
        this.ctx.setCursorBlink(blink)
        return this
    }

    public setCursor(pos: Point) {
        this.ctx.setCursorPos(pos.x + 1, pos.y + 1)
        return this
    }

    public getCursor() {
        const [x, y] = this.ctx.getCursorPos()
        return new Point(x - 1, y - 1)
    }

    public clear() {
        this.setCursor(Point.zero)
        this.ctx.clear()
        return this
    }

    public setForeground(color: number) {
        this.ctx.setTextColor(color)
        return this
    }

    public setBackground(color: number) {
        this.ctx.setBackgroundColor(color)
        return this
    }

    public setStyle(style: Style) {
        const platte = this.isColor ? COLOR_PALETTE : MONO_PALETTE
        const [bg, fg] = platte[style]

        this
            .setBackground(bg)
            .setForeground(fg)

        return this
    }

    public write(text: string) {
        this.ctx.write(text)
        return this
    }

    public drawRect(pos: Point, size: Point, text: string | null, textVertical = false) {
        for (let i = 0; i < size.y; i++) {
            this.setCursor(pos.add(0, i))
            if (text == null) {
                this.write(" ".repeat(size.x))
            } else {
                if (textVertical) {
                    if (i < text.length) {
                        this.write(text[i] + " ".repeat(size.x - 1))
                    } else {
                        this.write(" ".repeat(size.x))
                    }
                } else {
                    if (i == 0) {
                        this.write(text.padEnd(size.x, " "))
                    } else {
                        this.write(" ".repeat(size.x))
                    }
                }
            }
        }
    }

    constructor(
        public readonly ctx: term.Redirect
    ) {
        if (ctx == term.current()) {
            Logger.stopStdout()
        }

        const [w, h] = this.ctx.getSize()
        this.size = new Point(w, h)

        this
            .setBlink(false)
            .clear()
    }
}
