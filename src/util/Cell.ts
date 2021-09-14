import C from "../C";
import { Dir, Layer } from "../Enums";

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

export default class Cell {

    private static _cellCache: Cell[][][];

    readonly x: number;
    readonly y: number;
    readonly layer: Layer;
    readonly key: number;

    ///////////////////////////////////////////////////////
    // Constructor & Factory
    ///////////////////////////////////////////////////////

    private constructor(x: number, y: number, layer: Layer) {
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.key = (C.BOARD_WIDTH * C.BOARD_HEIGHT * layer) + (C.BOARD_WIDTH * y) + x;
    }

    static get(x: number, y: number, layer: Layer): Cell | null {
        if (Cell.xylValidBoardCell(x, y, layer))
            return Cell._cellCache[x][y][layer]!;
        else
            return null;
    }

    ///////////////////////////////////////////////////////
    // Math
    ///////////////////////////////////////////////////////

    addToCell(cell: Cell) {
        return Cell.addCellToCell(this, cell, this.layer);
    }

    addToXY(xOffset: number, yOffset: number) {
        return Cell.addCellToXY(this, xOffset, yOffset, this.layer);
    }

    ///////////////////////////////////////////////////////
    // Adjacency
    ///////////////////////////////////////////////////////

    neighbor(dir: Dir) {
        let offset = _PLANE_OFFSETS[dir];
        return Cell.addCellToXY(this, offset[0], offset[1], this.layer);
    }

    oppositeCell() {
        return Cell._cellCache[this.x][this.y][this.oppositeLayer()];
    }

    oppositeLayer() {
        return this.layer == Layer.ABOVE ? Layer.BELOW : Layer.ABOVE;
    }

    ///////////////////////////////////////////////////////
    // Iterators
    ///////////////////////////////////////////////////////

    *iterateNeighbors() {
        for (let offset of _PLANE_OFFSETS) {
            let neighbor = Cell.addCellToXY(this, offset[0], offset[1], this.layer);
            if (neighbor) {
                yield neighbor;
            }
        }
    }

    *iterateNeighborsWithDirection(): Generator<[Cell, Dir]> {
        for (let dir: Dir = 0; dir < 8; dir++) {
            let offset = _PLANE_OFFSETS[dir];
            let neighbor = Cell.addCellToXY(this, offset[0], offset[1], this.layer);
            if (neighbor) {
                yield [neighbor, dir];
            }
        }
    }

    ///////////////////////////////////////////////////////
    // Misc
    ///////////////////////////////////////////////////////

    onEdge() {
        return Cell.cellOnEdge(this);
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.layer})`;
    }

    ///////////////////////////////////////////////////////
    // STATIC
    ///////////////////////////////////////////////////////

    static addCellToCell(cellA: Cell, cellB: Cell, layer: Layer) {
        let newX = cellA.x + cellB.x;
        let newY = cellA.y + cellB.y;
        return Cell.get(newX, newY, layer);
    }

    static addCellToXY(cell: Cell, xOffset: number, yOffset: number, layer: Layer) {
        let newX = cell.x + xOffset;
        let newY = cell.y + yOffset;
        return Cell.get(newX, newY, layer);
    }

    static xylValidBoardCell(x: number, y: number, layer: Layer) {
        return x >= 0 && x < C.BOARD_WIDTH
            && y >= 0 && y < C.BOARD_HEIGHT
            && layer >= 0 && layer < C.BOARD_DEPTH;
    }

    static cellOnEdge(cell: Cell) {
        return cell.x == 0 || cell.x == C.BOARD_WIDTH - 1 || cell.y == 0 || cell.y == C.BOARD_HEIGHT - 1;
    }

    static xyOnEdge(x: number, y: number) {
        return x == 0 || x == C.BOARD_WIDTH - 1 || y == 0 || y == C.BOARD_HEIGHT - 1;
    }

    private static _initialize = (() => {
        Cell._cellCache = [];
        for (let x = 0; x < C.BOARD_WIDTH; x++) {
            Cell._cellCache[x] = [];
            for (let y = 0; y < C.BOARD_HEIGHT; y++) {
                Cell._cellCache[x][y] = [];
                for (let z = 0; z < C.BOARD_DEPTH; z++) {
                    let cell = new Cell(x, y, z);
                    Cell._cellCache[x][y][z] = cell;
                }
            }
        }

    })();

}