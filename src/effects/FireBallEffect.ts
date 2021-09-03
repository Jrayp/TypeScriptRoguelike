import { Color } from "rot-js/lib/color";
import { Direction } from "../Enums";
import G from "../G";
import Light from "../lights/Light";
import Coords from "../util/Coords";
import GMath from "../util/GMath";
import ExplosionGenerator from "./ExplosionEffectGenerator";
import _Effect from "./_Effect";

export default class FireballEffect extends _Effect {
    _glyph = '*';
    _fgColor = [244, 135, 22] as Color;
    _bgColor = null

    light: Light;

    lastCoords: Coords;
    path : Coords[];
    step = 1;

    constructor(path: Coords[]) {
        super();
        this.path = path;
        this.light = new Light(this, 8, this._fgColor);
        G.board.lights.addLight(this.light);
    }

    doStep() {
        if(this.step == this.path.length)
        {
            this.explode();
            return;
        }
        
        const coords = this.coords;
        const tile = G.board.tiles.getElementViaCoords(coords);
        if (!tile.passable || tile.occupant()) {
            this.explode();
        }
        else {
            this.lastCoords = coords;
            let dest = this.path[this.step];
            let destTile = G.board.tiles.getElementViaCoords(dest);
            if (!destTile.passable)
                this.explode();
            else
                G.board.effects.moveElement(this, dest);
        }
        this.step++;
    }

    explode() {
        const coords = this.coords;
        G.board.effects.removeViaElement(this);
        G.board.lights.removeLight(this.light);
        G.log.write("*Boom!* The fireball explodes!");

        let explosionGenerator = new ExplosionGenerator(coords, 2);
        G.board.effects.addGenerator(explosionGenerator, true);

    }
}


