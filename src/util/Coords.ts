import { assert } from "console";
import C from "./../C";

export default class Coords {

    readonly x: number;
    readonly y: number;
    readonly key: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.key = x + ',' + y;
    }

    isEdge() {
        return this.x == 0 || this.x == C.ARENA_WIDTH - 1 || this.y == 0 || this.y == C.ARENA_HEIGHT - 1;
    }

    ///////////////////////////////////////////////////////
    // STATIC
    ///////////////////////////////////////////////////////

    static addCoordsToCoords(coordsA: Coords, coordsB: Coords) {
        return new Coords(coordsA.x + coordsB.x, coordsA.y + coordsB.y);
    }

    static addCoordsToNumbers(coords: Coords, x: number, y: number) {
        return new Coords(coords.x + x, coords.y + y);
    }

}
