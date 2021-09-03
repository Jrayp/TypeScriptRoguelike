import { RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import _Actor from "./../actors/_Actor";
import G from "../G";
import { _BoardTile } from "./_BoardTile";

export class WaterTile extends _BoardTile {
    name = 'Water';
    _glyph = '~';
    _fgColor = [20, 75, 210] as Color;
    _bgColor = null;
    passable = true;
    transparent = true;

    onEnter(actor: _Actor) {
        if (actor === G.player)
            if (RNG.getUniform() < .98)
                return "*Splash* You wade through some water...";
            else
                return "SOMETHING TRIES TO DRAG YOU UNDERWATER... and lets go";
        else return undefined;
    }
}