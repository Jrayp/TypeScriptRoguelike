import { FOV } from 'rot-js';
import G from "./../G";
import Coords from "./../util/Coords";
import _Actor from "./_Actor";

export default class Player extends _Actor {

    glyph = '\u263B';
    fgColor = 'yellow'
    bgColor = null;

    sightRange = 10;
    private _fov = new FOV.PreciseShadowcasting(this.lightPasses);

    move(newCoords: Coords) {
        if (super.move(newCoords))
            return true;
        else {
            G.log.write("Ouch! You run into a wall!")
            return false
        }
    }

    computeFov() {
        const actorCoords = this.getCoords();
        const seenCells: Set<string> = new Set();

        function fovCallback(x: number, y: number, r: number, visibility: number) {
            seenCells.add(Coords.makeKey(x, y));
        }

        this._fov.compute(actorCoords.x, actorCoords.y, this.sightRange, fovCallback);

        return seenCells;
    }

    private lightPasses(x: number, y: number) {
        const key = Coords.makeKey(x, y);
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tileLayer.getElementViaKey(key).transparent;
    }


}