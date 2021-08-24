
import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export class WallTile extends _BoardTile {
    name = 'Wall';
    glyph = ' ';
    fgColor = null;
    bgColor = [25, 50, 75] as Color;
    passable = false;
    transparent = false;
}