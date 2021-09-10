import { RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import { Layer } from "./../Enums";
import G from "../G";
import _Actor from "./../actors/_Actor";
import { _BoardTile } from "./_BoardTile";

export class WaterTile extends _BoardTile {
    name = 'Water';
    _glyph = '~';
    _fgColor = [20, 75, 210] as Color;
    _bgColor = [6, 24, 63] as Color;
    passable = true;
    topPassable = true;
    bottomPassable = true;
    transparent = true;
    destroyable = false;

    constructor() {
        super();


    }


    get glyph() {
        if (this.position.layer === Layer.ABOVE || this.upMovementValid)
            return this._glyph;
        else
            return '.';
    }

    get bgColor() {
        if (this.position.layer === Layer.ABOVE)
            return this._bgColor;
        else
            return null;
    }

    onEnter(actor: _Actor) {
        if (actor.name === "Player")
            console.log(this.position.layer);
        if (actor === G.player)
            if (RNG.getUniform() < .98)
                return "*Splash* You wade through some water...";
            else
                return "SOMETHING TRIES TO DRAG YOU UNDERWATER... and lets go";
        else return undefined;
    }
}