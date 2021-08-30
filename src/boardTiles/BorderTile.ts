
import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export class BorderTile extends _BoardTile {
    name = 'Wall';
    _glyph = ' ';
    _fgColor = null;
    _bgColor = [50, 50, 50] as Color;
    passable = false;
    transparent = false;
    destroyable = false;
}