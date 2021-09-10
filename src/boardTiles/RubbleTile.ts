import { Color as ColorHelper, RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export class RubbleTile extends _BoardTile {
    name = 'Rubble';
    _glyph = ',';
    _fgColor = [35, 60, 85] as Color;
    _bgColor = null;
    passable = true;
    topPassable = true;
    bottomPassable = false;
    transparent = true;
    destroyable = false;

    static possibleGlyphs: [string, string, string, string, string, string] = ['%', ',', ';', '`', ':', '.']

    constructor(color: Color) {
        super();
        this._glyph = RNG.getItem(RubbleTile.possibleGlyphs)!;
        this._fgColor = ColorHelper.randomize(color, 5);
    }

}