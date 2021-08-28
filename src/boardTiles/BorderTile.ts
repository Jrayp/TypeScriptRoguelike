
import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export class BorderTile extends _BoardTile {
    name = 'Wall';
    glyph = ' ';
    fgColor = null;
    bgColor = [50, 50, 50] as Color;
    passable = false;
    transparent = false;
}