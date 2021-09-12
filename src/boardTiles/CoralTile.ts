import { Color as ColorHelper, RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./_BoardTile";

export default class CoralTile extends _BoardTile {
    name = 'Coral';
    _glyph = '&';
    _fgColor: Color;
    _bgColor = null;
    passable = true;
    topPassable = true;
    bottomPassable = false;
    transparent = true;
    destroyable = true;

    multiplyBelow = false

    constructor() {
        super();
        this._glyph = RNG.getItem(['&', '"'])!;
        this._fgColor = ColorHelper.randomize(RNG.getUniform() < .5 ? [200, 25, 75] : [75, 25, 200], 50);
    }





}