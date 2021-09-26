import { Color } from "rot-js/lib/color";
import Sound from "./../audio/Sound";
import G from "../G";
import Light from "../lights/Light";
import Cell from "../util/Cell";
import ExplosionGenerator from "./ExplosionEffectGenerator";
import _Effect from "./_Effect";

export default class FireballEffect extends _Effect {
    _glyph = '*';
    _fgColor = [244, 135, 22] as Color;
    _bgColor = null

    light: Light;

    lastCell: Cell;
    path: Cell[];
    step = 1;

    sound: Sound;

    constructor(path: Cell[]) {
        super();
        this.path = path;
        this.light = new Light(this, 8, this._fgColor);
        G.board.lights.addLight(this.light);

        this.sound = new Sound('./../assets/audio/105016__julien-matthey__jm-fx-fireball-01.wav', false, 18,  this);
        G.board.sounds.add(this.sound);
        // G.board.sounds.update();

    }

    doStep() {
        if (this.step == this.path.length) {
            this.explode();
            return;
        }

        const cell = this.position;
        const tile = G.board.tiles.getElementViaCell(cell);
        if (!tile.passable || tile.occupant()) {
            this.explode();
        }
        else {
            this.lastCell = cell;
            let dest = this.path[this.step];
            let destTile = G.board.tiles.getElementViaCell(dest);
            if (!destTile.passable)
                this.explode();
            else
                G.board.effects.moveElementToCell(this, dest);
        }
        this.step++;
    }

    explode() {

        this.sound.destroy();

        const cell = this.position;
        G.board.effects.removeViaElement(this);
        G.board.lights.removeLight(this.light);
        G.log.write("*Boom!* The fireball explodes!");

        let explosionGenerator = new ExplosionGenerator(cell, 2);
        G.board.effects.addGenerator(explosionGenerator, true);

    }
}


