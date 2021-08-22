import { Color } from "rot-js";
import { _BoardTile } from "./_BoardTile";

export class FloorTile extends _BoardTile {
    name = 'Floor';
    glyph = '.';
    fgColor = Color.toRGB([100, 100, 100]);
    bgColor = null;
    passable = true;
    transparent = true;
    
}