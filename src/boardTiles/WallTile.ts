
import { Color } from "rot-js/lib/color";
import _DiggableTile from "./_DiggableTile";

export class WallTile extends _DiggableTile {

    name = 'Wall';
    _glyph = ' ';
    _fgColor = [0, 0, 0] as Color;
    _bgColor = [25, 50, 75] as Color;
    passable = false;
    topPassable = false;
    bottomPassable = false;
    transparent = false;
    destroyable = true;

    digStrength = 3;

}