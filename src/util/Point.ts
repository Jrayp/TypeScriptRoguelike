import C from "../C";
import { Direction, Layer } from "../Enums";
import { assertTrue } from "./Assertions";

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

    private static _pointCache: Point[][][];
    private static _KeyToPointCache: Map<number, Point>;


    readonly x: number;
    readonly y: number;
    readonly layer: Layer;
    readonly key: number;

    ///////////////////////////////////////////////////////
    // Constructor & Factory
    ///////////////////////////////////////////////////////

    private constructor(x: number, y: number, layer: Layer) {
        assertTrue(Point.xylValidBoardPoint(x, y, layer));

        if (Point.xylValidBoardPoint(x, y, layer)) {
            const p = Point.getFromXYL(x, y, layer);
            if (p) {
                return p;
            }
        }

        this.x = x;
        this.y = y;
        this.layer = layer;
        this.key = Point.computeKeyFromXYL(x, y, layer);

        console.log("New Point");
    }

    static getFromXYL(x: number, y: number, layer: Layer): Point {
        assertTrue(Point.xylValidBoardPoint(x, y, layer))
        return Point._pointCache[x][y][layer]!;
    }

    static getFromKey(key: number): Point {
        assertTrue(Point._KeyToPointCache.has(key))
        return Point._KeyToPointCache.get(key)!;
    }

    ///////////////////////////////////////////////////////
    // Math
    ///////////////////////////////////////////////////////

    addPoint(point: Point) {
        return Point.addPointToPoint(this, point, this.layer);
    }

    addXY(xOffset: number, yOffset: number) {
        return Point.addPointToXY(this, xOffset, yOffset, this.layer);
    }

    ///////////////////////////////////////////////////////
    // Adjacency
    ///////////////////////////////////////////////////////

    neighbor(dir: Direction) {
        let offset = _PLANE_OFFSETS[dir];
        return Point.addPointToXY(this, offset[0], offset[1], this.layer);
    }

    oppositePoint() {
        return Point.getFromXYL(this.x, this.y, this.oppositeLayer());
    }

    oppositeLayer() {
        return this.layer === Layer.ABOVE ? Layer.BELOW : Layer.ABOVE;
    }

    ///////////////////////////////////////////////////////
    // Iterators
    ///////////////////////////////////////////////////////

    *iterateNeighbors() {
        for (let offset of _PLANE_OFFSETS) {
            let n = Point.addPointToXY(this, offset[0], offset[1], this.layer);
            if (n)
                yield n;
        }
    }

    ///////////////////////////////////////////////////////
    // Misc
    ///////////////////////////////////////////////////////

    toString() {
        return `(${this.x}, ${this.y}, ${this.layer})`;
    }

    ///////////////////////////////////////////////////////
    // STATIC
    ///////////////////////////////////////////////////////

    static addPointToPoint(pointA: Point, pointB: Point, layer: Layer) {
        let newX = pointA.x + pointB.x;
        let newY = pointA.y + pointB.y;
        if (Point.xylValidBoardPoint(newX, newY, layer))
            return Point._pointCache[newX][newY][layer];
        else
            return null;
    }

    static addPointToXY(point: Point, xOffset: number, yOffset: number, layer: Layer) {
        let newX = point.x + xOffset;
        let newY = point.y + yOffset;
        if (Point.xylValidBoardPoint(newX, newY, layer))
            return Point._pointCache[newX][newY][layer];
        else
            return null;
    }

    // static computePointFromKey(i: number, width: number = C.BOARD_WIDTH, height: number = C.BOARD_HEIGHT) {
    //     let z = Math.floor(i / (width * height));
    //     i -= (z * width * height);
    //     let y = Math.floor(i / width);
    //     let x = Math.floor(i % width);
    //     return Point.getFromXYL(x, y, z);
    // }

    static computeKeyFromXYL(x: number, y: number, layer: Layer, width: number = C.BOARD_WIDTH, height: number = C.BOARD_HEIGHT) {
        return (layer * width * height) + (y * width) + x;
    }

    static xylValidBoardPoint(x: number, y: number, layer: Layer) {
        return Number.isInteger(x)
            && Number.isInteger(y)
            && Number.isInteger(layer)
            && x >= 0 && x < C.BOARD_WIDTH
            && y >= 0 && y < C.BOARD_HEIGHT
            && layer >= 0 && layer < C.BOARD_DEPTH;
    }

    private static _initialize = (() => {
        Point._KeyToPointCache = new Map<number, Point>();
        Point._pointCache = [];
        for (let x = 0; x < C.BOARD_WIDTH; x++) {
            Point._pointCache[x] = [];
            for (let y = 0; y < C.BOARD_HEIGHT; y++) {
                Point._pointCache[x][y] = [];
                for (let z = 0; z < C.BOARD_DEPTH; z++) {
                    let point = new Point(x, y, z);
                    Point._pointCache[x][y][z] = point;
                    Point._KeyToPointCache.set(point.key, point);
                }
            }
        }

    })();

}
