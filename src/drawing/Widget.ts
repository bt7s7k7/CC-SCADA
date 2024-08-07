import { Logger } from "../support/Logger"
import { Drawer, Style } from "./Drawer"
import { Point } from "./Point"

export class Widget {
    public style: Style | null = null
    public position = Point.NaN
    public size = Point.NaN
    public parent: Widget | null = null
    public content: Widget[] | string | null = null
    public grow = false
    public overflow: "show" | "hide" | "wrap" = "show"
    public scroll = -1
    public axis: "row" | "column" = "row"
    public onClick: (() => void) | null = null

    constructor(opt: Omit<Partial<Widget>, "position" | "size">) {
        Object.assign(this, opt)
    }

    public static calculateLayout(root: Widget, viewport: Point) {
        const sizeCache = new Map<Widget, Point>()
        function getMinimumSize(target: Widget) {
            const cached = sizeCache.get(target)
            if (cached != null) return cached

            let size

            if (target.content == null) {
                size = Point.one
            } else if (typeof target.content == "string") {
                if (target.axis == "row") {
                    size = new Point(target.content.length, 1)
                } else {
                    size = new Point(1, target.content.length)
                }
            } else {
                const axis = target.axis
                let width = 0
                let height = 0
                for (const child of target.content) {
                    const childSize = getMinimumSize(child)
                    if (axis == "row") {
                        width += childSize.x
                        height = Math.max(height, childSize.y)
                    } else {
                        height += childSize.y
                        width = Math.max(width, childSize.x)
                    }
                }

                size = new Point(width, height)
            }

            sizeCache.set(target, size)
            return size
        }

        const overflow: Widget[] = []

        function layout(target: Widget) {
            if (target.content == null || typeof target.content == "string") return

            const size = target.size
            const axis = target.axis
            const childSizes: number[] = []
            const mainArg = axis == "row" ? "x" : "y"
            let growCount = 0
            let leftover = size[mainArg]
            for (const child of target.content) {
                const size = getMinimumSize(child)
                const main = size[mainArg]
                childSizes.push(main)
                if (child.grow) growCount++
                leftover -= main
            }

            if (leftover < 0) {
                if (target.overflow != "show") overflow.push(target)
                leftover = 0
            }

            const growSize = Math.floor(leftover / growCount)
            let growFix = leftover % growCount
            let offset = 0

            for (let i = 0; i < target.content.length; i++) {
                const child = target.content[i]
                let size = childSizes[i]
                if (child.grow) {
                    size += growSize + growFix
                    growFix = 0
                }

                child.position = axis == "row" ? target.position.add(offset, 0) : target.position.add(0, offset)
                child.size = axis == "row" ? new Point(size, target.size.y) : new Point(target.size.x, size)

                layout(child)

                offset += size
            }
        }

        root.position = Point.zero
        root.size = viewport
        layout(root)

        if (overflow.length > 0) {
            for (const target of overflow) {
                if (target.content == null || typeof target.content == "string") Logger.abort("Should only have parent widgets")

                const size = target.size
                const axis = target.axis
                const mainArg = axis == "row" ? "x" : "y"
                const mainSize = size[mainArg]

                let leftover = mainSize
                const lines: Widget[][] = [[]]
                for (const child of target.content) {
                    const size = getMinimumSize(child)
                    const main = size[mainArg]

                    if (leftover - main < 0) {
                        if (target.overflow == "hide") break
                        lines.push([])
                        leftover = mainSize
                    }
                    leftover -= main
                    lines[lines.length - 1].push(child)
                }

                if (lines[0].length == 0) lines.splice(0, 1)

                target.axis = axis == "row" ? "column" : "row"
                target.content = lines.map(v => new Widget({ axis, content: v }))
            }

            sizeCache.clear()
            layout(root)
        }
    }

    public static draw(root: Widget, drawer: Drawer) {
        const drawn: Widget[] = []
        function visit(target: Widget) {
            drawn.push(target)
            const text = typeof target.content == "string" ? target.content : null

            if (target.content != null) {
                drawer.setStyle(target.style!)
                drawer.drawRect(target.position, target.size, text, target.axis == "column")
            }

            if (target.content == null || typeof target.content == "string") return
            for (const child of target.content) {
                if (child.style == null) {
                    child.style = target.style
                }

                child.parent = target

                visit(child)
            }
        }

        visit(root)
        return drawn.reverse()
    }
}
