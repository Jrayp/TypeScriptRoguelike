import { Color } from "rot-js";
import { _BoardTile } from "./_BoardTile";

export class WallTile extends _BoardTile {
    name = 'Wall';
    glyph = ' ';
    fgColor = null;
    bgColor = Color.toRGB([25, 50, 75]);
    passable = false;
    transparent = false;
}