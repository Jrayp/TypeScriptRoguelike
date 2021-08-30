import Coords from "./../util/Coords";
import G from "./../G";
import _EffectGenerator from "./_EffectGenerator";
import ExplosionEffect from "./ExplosionEffect";


export default class ExplosionGenerator extends _EffectGenerator {

    center: Coords;
    radius = 3;
    step = 0;

    constructor(center: Coords, radius: number) {
        super();
        this.center = center;
        this.radius = radius;
    }

    generate() {
        if (this.step == 0)
            G.board.effects.set(this.center, new ExplosionEffect());
        else {
            for (let c of G.board.tiles.iterateCircumference(this.center, this.step + .5)) {
                if (G.board.tiles.hasCoords(c[0]))
                    G.board.effects.set(c[0], new ExplosionEffect());
            }
        }
        if (this.step == this.radius)
            G.board.effects.removeGenerator(this);

        this.step++;
    }

}