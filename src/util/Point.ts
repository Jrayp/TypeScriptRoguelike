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
    readonly z: number;
    readonly key: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.key = Point.toInt(x, y, z);
    }

    addPoint(point: Point) {
        return Point.addPointToPoint(this, point);
    }

    neighbor(dir: Direction) {
        let a = Point._OFFSETS[dir];
        return Point.addPointToNumbers(this, a[0], a[1], 0);
    }

    *iterateNeighbors() {
        for (let a of Point._OFFSETS)
            yield Point.addPointToNumbers(this, a[0], a[1], 0);
    }

    ///////////////////////////////////////////////////////
    // STATIC
    ///////////////////////////////////////////////////////

    static addPointToPoint(pointA: Point, pointB: Point) {
        return new Point(pointA.x + pointB.x, pointA.y + pointB.y, pointA.z + pointB.z);
    }

    static addPointToNumbers(point: Point, x: number, y: number, z: number) {
        return new Point(point.x + x, point.y + y, point.z + z);
    }

    static fromInt(i: number, width: number = C.BOARD_WIDTH, height: number = C.BOARD_HEIGHT) {
        let z = i / (width * height);
        i -= (z * width * height);
        let y = i / width;
        let x = i % width;
        return new Point(x, y, z);
    }

    static toInt(x: number, y: number, z: number, width: number = C.BOARD_WIDTH, height: number = C.BOARD_HEIGHT) {
        return (z * width * height) + (y * width) + x;
    }


}
