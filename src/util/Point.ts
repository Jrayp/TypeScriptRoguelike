import C from "../C";
import { Direction, Layer } from "../Enums";

export default class Point {

    private static readonly _PLANE_OFFSETS = [
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
    readonly layer: Layer;
    readonly key: number;

    constructor(x: number, y: number, layer: Layer) {
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.key = Point.toKey(x, y, layer);
    }

    addPoint(point: Point) {
        return Point.addPointToPoint(this, point, this.layer);
    }

    addNumbers(xOffset: number, yOffset: number) {
        return Point.addPointToNumbers(this, xOffset, yOffset, this.layer);
    }

    neighbor(dir: Direction) {
        let offset = Point._PLANE_OFFSETS[dir];
        return Point.addPointToNumbers(this, offset[0], offset[1], this.layer);
    }

    opposite() {
        let z = this.layer === Layer.ABOVE ? Layer.BELOW : Layer.ABOVE;
        return new Point(this.x, this.y, z);
    }

    *iterateNeighbors() {
        for (let a of Point._PLANE_OFFSETS)
            yield Point.addPointToNumbers(this, a[0], a[1], this.layer);
    }

    ///////////////////////////////////////////////////////
    // STATIC
    ///////////////////////////////////////////////////////

    static addPointToPoint(pointA: Point, pointB: Point, layer: Layer) {
        return new Point(pointA.x + pointB.x, pointA.y + pointB.y, layer);
    }

    static addPointToNumbers(point: Point, xOffset: number, yOffset: number, layer: Layer) {
        return new Point(point.x + xOffset, point.y + yOffset, layer);
    }

    static fromKey(i: number, width: number = C.BOARD_WIDTH, height: number = C.BOARD_HEIGHT) {
        let z = i / (width * height);
        i -= (z * width * height);
        let y = i / width;
        let x = i % width;
        return new Point(x, y, z);
    }

    static toKey(x: number, y: number, z: number, width: number = C.BOARD_WIDTH, height: number = C.BOARD_HEIGHT) {
        return (z * width * height) + (y * width) + x;
    }


}
