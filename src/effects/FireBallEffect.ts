import { Color } from "rot-js/lib/color";
import { Direction } from "../Enums";
import G from "../G";
import Light from "../lights/Light";
import Coords from "../util/Coords";
import GMath from "../util/GMath";
import _Effect from "./_Effect";

export default class FireballEffect extends _Effect {
    _glyph = '*';
    _fgColor = [244, 105, 22] as Color;
    _bgColor = null

    light: Light;

    constructor() {
        super();
        this.light = new Light(this, 5, this._fgColor);
        G.board.lights.addLight(this.light);
    }

    doStep() {
        const coords = this.coords;
        const tile = G.board.tiles.getElementViaCoords(coords);
        if (!tile.passable || tile.occupant()) {
            this.explode();
        }
        else {
            let dest = Coords.addCoordsToCoords(coords, GMath.DIR_COORDS[Direction.N])
            G.board.effects.moveElement(this, dest);
        }
    }

    explode() {
        G.board.effects.removeViaElement(this);
        G.board.lights.removeLight(this.light);
        G.log.write("*Boom!* The fireball explodes!");
        // G.board.actionLayer.set(this.coords, new ExplosionAction());
    }
}


