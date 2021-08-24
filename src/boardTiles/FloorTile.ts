import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export class FloorTile extends _BoardTile {
    name = 'Floor';
    glyph = '.';
    fgColor = [100, 100, 100] as Color;
    bgColor = null;
    passable = true;
    transparent = true;

}