import C from "../C";
import { Direction } from "../Enums";

export default class Point {

    private static readonly _OFFSETS = [
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1]
    ]

    readonly x: number;
    readonly y: number;
    readonly key: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.key = Point.toInt(x, y);
    }

    addPoint(point: Point) {
        return Point.addPointToPoint(this, point);
    }

    neighbor(dir: Direction) {
        let a = Point._OFFSETS[dir];
        return Point.addPointToNumbers(this, a[0], a[1]);
    }

    *iterateNeighbors() {
        for (let a of Point._OFFSETS)
            yield Point.addPointToNumbers(this, a[0], a[1]);
    }

    ///////////////////////////////////////////////////////
    // STATIC
    ///////////////////////////////////////////////////////

    static addPointToPoint(pointA: Point, pointB: Point) {
        return new Point(pointA.x + pointB.x, pointA.y + pointB.y);
    }

    static addPointToNumbers(point: Point, x: number, y: number) {
        return new Point(point.x + x, point.y + y);
    }

    static fromInt(i: number, width: number = C.BOARD_WIDTH) {
        let x = i % width;
        let y = Math.trunc(i / width);
        return new Point(x, y);
    }

    static toInt(x: number, y: number, width: number = C.BOARD_WIDTH) {
        return x + width * y;
    }


}
