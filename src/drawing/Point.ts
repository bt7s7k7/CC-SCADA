export class Point {

    public add(x: number, y: number): Point
    public add(other: Point): Point
    public add(...args: any[]): Point {
        if (args.length == 2) {
            return new Point(this.x + args[0], this.y + args[1])
        } else {
            return new Point(this.x + args[0].x, this.y + args[0].y)
        }
    }

    public mul(mul: number) {
        return new Point(this.x * mul, this.y * mul)
    }

    public floor() {
        return new Point(Math.floor(this.x), Math.floor(this.y))
    }

    constructor(
        public readonly x: number,
        public readonly y: number
    ) { }

    /** [1, 1] */
    static readonly one = new Point(1, 1)
    /** [0, 0] */
    static readonly zero = new Point(0, 0)
    /** [0, -1] */
    static readonly up = new Point(0, -1)
    /** [0, 1] */
    static readonly down = new Point(0, 1)
    /** [-1, 0] */
    static readonly left = new Point(-1, 0)
    /** [1, 0] */
    static readonly right = new Point(1, 0)
    static readonly NaN = new Point(NaN, NaN)
}
