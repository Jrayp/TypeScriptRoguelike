import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export class RubbleTile extends _BoardTile {
    name = 'Rubble';
    glyph = ',';
    fgColor = [25, 50, 75] as Color;
    bgColor = null;
    passable = true;
    transparent = true;

}