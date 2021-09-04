import { Direction } from "../Enums";

export default class Coords {

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
    readonly key: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.key = Coords.makeKey(x, y);
    }

    addCoords(coords: Coords) {
        return Coords.addCoordsToCoords(this, coords);
    }

    neighbor(dir: Direction) {
        let a = Coords._OFFSETS[dir];
        return Coords.addCoordsToNumbers(this, a[0], a[1]);
    }

    *iterateNeighbors() {
        for (let a of Coords._OFFSETS)
            yield Coords.addCoordsToNumbers(this, a[0], a[1]);
    }

    ///////////////////////////////////////////////////////
    // STATIC
    ///////////////////////////////////////////////////////

    static makeKey(x: number, y: number) {
        return x + ',' + y;
    }

    static addCoordsToCoords(coordsA: Coords, coordsB: Coords) {
        return new Coords(coordsA.x + coordsB.x, coordsA.y + coordsB.y);
    }

    static addCoordsToNumbers(coords: Coords, x: number, y: number) {
        return new Coords(coords.x + x, coords.y + y);
    }

}
