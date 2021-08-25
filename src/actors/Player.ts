import { Color, FOV, RNG } from 'rot-js';
import G from "../G";
import Coords from "./../util/Coords";
import _Actor from "./_Actor";

export default class Player extends _Actor {
    name = "Player";
    glyph = '\u263B';
    fgColor = Color.fromString("brown");
    bgColor = null;

    sightRange = 10;
    private _fov = new FOV.PreciseShadowcasting(this.lightPasses);

    currentlySeenCoordKeys = new Set<string>();

    move(newCoords: Coords) {


        if (super.move(newCoords)) {
            if (G.board.lightManager.lightMap.get(newCoords.key) == null && RNG.getUniform() < .25) {
                G.log.write("It's very dark here...");
            }
            return true;
        }
        else {
            G.log.write("Ouch! You run into a wall!")
            return false
        }
    }

    computeFov() {
        const actorCoords = this.getCoords();
        this.currentlySeenCoordKeys.clear();

        this._fov.compute(actorCoords.x, actorCoords.y, this.sightRange, this.fovCallback);

        return this.currentlySeenCoordKeys;
    }

    // Using arrow notation to bind 'this' to the callback
    private fovCallback = (x: number, y: number, r: number, visibility: number) => {
        this.currentlySeenCoordKeys.add(Coords.makeKey(x, y));
    }

    private lightPasses(x: number, y: number) {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tileLayer.getElementViaKey(Coords.makeKey(x, y)).transparent;
    }


}