import { Drawer, Style } from "./Drawer"
import { Point } from "./Point"

export class Widget {
    public style: Style | null = null
    public position = Point.NaN
    public size = Point.NaN
    public content: Widget[] | string | null = null
    public grow = false
    public scroll = -1
    public axis: "row" | "column" = "row"

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

        function layout(target: Widget) {
            if (target.content == null || typeof target.content == "string") return

            const size = target.size
            const axis = target.axis
            const childSizes: number[] = []
            let growCount = 0
            let leftover = axis == "row" ? size.x : size.y
            for (const child of target.content) {
                const size = getMinimumSize(child)
                const main = axis == "row" ? size.x : size.y
                childSizes.push(main)
                if (child.grow) growCount++
                leftover -= main
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

                visit(child)
            }
        }

        visit(root)
    }
}
