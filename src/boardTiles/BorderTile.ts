
import { Color } from "rot-js/lib/color";
import _Actor from "src/actors/_Actor";
import { _BoardTile } from "./_BoardTile";

export class BorderTile extends _BoardTile {
    name = 'Wall';
    _glyph = ' ';
    _fgColor = null;
    _bgColor = [50, 50, 50] as Color;
    passable = false;
    topPassable = false;
    bottomPassable = false;
    transparent = false;
    destroyable = false;

    getTraverseCost(actor: _Actor): number {
        return -1;
    }

}