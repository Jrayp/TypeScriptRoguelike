import { RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import Point from "./../util/Point";
import G from "../G";
import _Actor from "./../actors/_Actor";
import { _BoardTile } from "./_BoardTile";

export class WaterTile extends _BoardTile {
    name = 'Water';
    _glyph = '~';
    _fgColor = [20, 75, 210] as Color;
    _bgColor = [6, 24, 63] as Color;
    passable = true;
    transparent = true;

    get glyph() {
        if (this.position.z === 0 || G.board.tiles.getElementViaPoint(this.position!.addPoint(new Point(0, 0, -1))).name === "Water")
            return this._glyph;
        else
            return '.';
    }

    get bgColor() {
        if (this.position.z === 0)
            return this._bgColor;
        else
            return null;
    }

    onEnter(actor: _Actor) {
        if (actor.name === "Player")
            console.log(this.position.z);
        if (actor === G.player)
            if (RNG.getUniform() < .98)
                return "*Splash* You wade through some water...";
            else
                return "SOMETHING TRIES TO DRAG YOU UNDERWATER... and lets go";
        else return undefined;
    }
}