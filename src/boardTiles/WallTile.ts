
import { Color } from "rot-js/lib/color";
import _DiggableTile from "./_DiggableTile";

export class WallTile extends _DiggableTile {

    name = 'Wall';
    glyph = ' ';
    fgColor = [0, 0, 0] as Color;
    bgColor = [25, 50, 75] as Color;
    passable = false;
    transparent = false;

    digStrength = 3;

}