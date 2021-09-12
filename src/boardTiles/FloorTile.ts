import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export class FloorTile extends _BoardTile {
    name = 'Floor';
    _glyph = '.';
    _fgColor = [100, 100, 100] as Color;
    _bgColor = null;
    passable = true;
    topPassable = true;
    bottomPassable = false;
    transparent = true;
    destroyable = true;
}