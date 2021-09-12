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

    readonly x: number;
    readonly y: number;
    readonly layer: Layer;

    ///////////////////////////////////////////////////////
    // Constructor & Factory
    ///////////////////////////////////////////////////////

    private constructor(x: number, y: number, layer: Layer) {
        this.x = x;
        this.y = y;
        this.layer = layer;
    }

    static get(x: number, y: number, layer: Layer): Point | null {
        if (Point.xylValidBoardPoint(x, y, layer))
            return Point._pointCache[x][y][layer]!;
        else
            return null;
    }

    ///////////////////////////////////////////////////////
    // Math
    ///////////////////////////////////////////////////////

    addToPoint(point: Point) {
        return Point.addPointToPoint(this, point, this.layer);
    }

    addToXY(xOffset: number, yOffset: number) {
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
        return Point._pointCache[this.x][this.y][this.oppositeLayer()];
    }

    oppositeLayer() {
        return this.layer === Layer.ABOVE ? Layer.BELOW : Layer.ABOVE;
    }

    ///////////////////////////////////////////////////////
    // Iterators
    ///////////////////////////////////////////////////////

    *iterateNeighbors() {
        for (let offset of _PLANE_OFFSETS) {
            let neighbor = Point.addPointToXY(this, offset[0], offset[1], this.layer);
            if (neighbor) {
                yield neighbor;
            }
        }
    }

    ///////////////////////////////////////////////////////
    // Misc
    ///////////////////////////////////////////////////////

    onEdge() {
        return Point.pointOnEdge(this);
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.layer})`;
    }

    ///////////////////////////////////////////////////////
    // STATIC
    ///////////////////////////////////////////////////////

    static addPointToPoint(pointA: Point, pointB: Point, layer: Layer) {
        let newX = pointA.x + pointB.x;
        let newY = pointA.y + pointB.y;
        return Point.get(newX, newY, layer);
    }

    static addPointToXY(point: Point, xOffset: number, yOffset: number, layer: Layer) {
        let newX = point.x + xOffset;
        let newY = point.y + yOffset;
        return Point.get(newX, newY, layer);
    }

    static xylValidBoardPoint(x: number, y: number, layer: Layer) {
        return x >= 0 && x < C.BOARD_WIDTH
            && y >= 0 && y < C.BOARD_HEIGHT
            && layer >= 0 && layer < C.BOARD_DEPTH;
    }

    static pointOnEdge(point: Point) {
        return point.x == 0 || point.x == C.BOARD_WIDTH - 1 || point.y == 0 || point.y == C.BOARD_HEIGHT - 1;
    }

    static xyOnEdge(x: number, y: number) {
        return x == 0 || x == C.BOARD_WIDTH - 1 || y == 0 || y == C.BOARD_HEIGHT - 1;
    }

    private static _initialize = (() => {
        Point._pointCache = [];
        for (let x = 0; x < C.BOARD_WIDTH; x++) {
            Point._pointCache[x] = [];
            for (let y = 0; y < C.BOARD_HEIGHT; y++) {
                Point._pointCache[x][y] = [];
                for (let z = 0; z < C.BOARD_DEPTH; z++) {
                    let point = new Point(x, y, z);
                    Point._pointCache[x][y][z] = point;
                }
            }
        }

    })();

}