import { Color as ColorHelper, RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export class RubbleTile extends _BoardTile {
    name = 'Rubble';
    glyph = ',';
    fgColor = [25, 50, 75] as Color;
    bgColor = null;
    passable = true;
    transparent = true;

    static possibleGlyphs: [string, string, string, string, string] = ['%', ',', ';', '`', ':']

    constructor(color: Color) {
        super();
        this.glyph = RNG.getItem(RubbleTile.possibleGlyphs)!;
        this.fgColor = ColorHelper.randomize(color, 5);
    }

}