import C from "../C";
import { Direction, Layer } from "../Enums";

const _PLANE_OFFSETS = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
]

export default class Point {

    readonly x: number;
    readonly y: number;
    readonly layer: Layer;
    readonly key: number;

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

    static toKey(x: number, y: number, layer: Layer, width: number = C.BOARD_WIDTH, height: number = C.BOARD_HEIGHT) {
        return (layer * width * height) + (y * width) + x;
    }

    ///////////////////////////////////////////////////////
    // Constructor
    ///////////////////////////////////////////////////////

    constructor(x: number, y: number, layer: Layer) {
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.key = Point.toKey(x, y, layer);
    }

    ///////////////////////////////////////////////////////
    // Math
    ///////////////////////////////////////////////////////

    addPoint(point: Point) {
        return Point.addPointToPoint(this, point, this.layer);
    }

    addNumbers(xOffset: number, yOffset: number) {
        return Point.addPointToNumbers(this, xOffset, yOffset, this.layer);
    }

    ///////////////////////////////////////////////////////
    // Adjacency
    ///////////////////////////////////////////////////////

    neighbor(dir: Direction) {
        let offset = _PLANE_OFFSETS[dir];
        return Point.addPointToNumbers(this, offset[0], offset[1], this.layer);
    }

    oppositePoint() {
        return new Point(this.x, this.y, this.oppositeLayer());
    }

    oppositeLayer() {
        return this.layer === Layer.ABOVE ? Layer.BELOW : Layer.ABOVE;
    }

    ///////////////////////////////////////////////////////
    // Iterators
    ///////////////////////////////////////////////////////

    *iterateNeighbors() {
        for (let a of _PLANE_OFFSETS)
            yield Point.addPointToNumbers(this, a[0], a[1], this.layer);
    }

    ///////////////////////////////////////////////////////
    // Misc
    ///////////////////////////////////////////////////////

    toString() {
        return `(${this.x}, ${this.y}, ${this.layer})`;
    }

}
