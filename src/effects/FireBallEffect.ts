import { Color } from "rot-js/lib/color";
import G from "../G";
import Light from "../lights/Light";
import Point from "../util/Point";
import ExplosionGenerator from "./ExplosionEffectGenerator";
import _Effect from "./_Effect";

export default class FireballEffect extends _Effect {
    _glyph = '*';
    _fgColor = [244, 135, 22] as Color;
    _bgColor = null

    light: Light;

    lastPoint: Point;
    path : Point[];
    step = 1;

    constructor(path: Point[]) {
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
        
        const point = this.position;
        const tile = G.board.tiles.getElementViaPoint(point);
        if (!tile.passable || tile.occupant) {
            this.explode();
        }
        else {
            this.lastPoint = point;
            let dest = this.path[this.step];
            let destTile = G.board.tiles.getElementViaPoint(dest);
            if (!destTile.passable)
                this.explode();
            else
                G.board.effects.moveElement(this, dest);
        }
        this.step++;
    }

    explode() {
        const point = this.position;
        G.board.effects.removeViaElement(this);
        G.board.lights.removeLight(this.light);
        G.log.write("*Boom!* The fireball explodes!");

        let explosionGenerator = new ExplosionGenerator(point, 2);
        G.board.effects.addGenerator(explosionGenerator, true);

    }
}


