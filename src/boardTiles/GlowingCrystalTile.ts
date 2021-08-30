import { RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import _Actor from "../actors/_Actor";
import Light from "../lights/Light";
import G from "../G";
import { _BoardTile } from "./_BoardTile";

export class GlowingCrystalTile extends _BoardTile {
    name = 'Glowing Crystal';
    _glyph = '*';
    _fgColor: Color;
    _bgColor = null;
    passable = true;
    transparent = true;

    glow: Light;

    constructor() {
        super();
        this._fgColor = [RNG.getUniformInt(0, 75), RNG.getUniformInt(155, 255), RNG.getUniformInt(75, 255)];
        this.glow = new Light(this, RNG.getUniformInt(3, 8), this._fgColor);
        G.board.lightManager.addLight(this.glow);
    }

    onEnter(actor: _Actor) {
        return "The crystal is eerily cold to the touch.";
    }

    onRemove() {
        this.glow.extinguish();
    }
}