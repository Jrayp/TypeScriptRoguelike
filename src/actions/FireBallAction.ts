import { Color } from "rot-js/lib/color";
import { Direction } from "./../Enums";
import Coords from "./../util/Coords";
import GMath from "./../util/GMath";
import G from "./../G";
import _Action from "./_Action";
import Light from "./../lights/Light";
import Board from "src/Board";
import ExplosionAction from "./ExplosionAction";

export default class FireballAction extends _Action {
    glyph = '*';
    fgColor = [244, 132, 22] as Color;
    bgColor = null

    light: Light;

    constructor() {
        super();
        this.light = new Light(this, 8, this.fgColor);
        G.board.lightManager.addLight(this.light);
    }

    doStep() {
        const coords = this.coords;
        const tile = G.board.tileLayer.getElementViaCoords(coords);
        if (!tile.passable || tile.occupant()) {
            this.explode();
        }
        else {
            let dest = Coords.addCoordsToCoords(coords, GMath.DIR_COORDS[Direction.N])
            G.board.actionLayer.moveElement(this, dest);
        }
    }

    explode() {
        G.board.actionManager.removeAction(this);
        G.board.lightManager.removeLight(this.light);
        G.log.write("*Boom!* The fireball explodes!");
        // G.board.actionLayer.set(this.coords, new ExplosionAction());
    }
}


