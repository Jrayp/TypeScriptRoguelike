import Point from "../util/Point";
import G from "./../G";
import _EffectGenerator from "./_EffectGenerator";
import ExplosionEffect from "./ExplosionEffect";
import Light from "src/lights/Light";


export default class ExplosionGenerator extends _EffectGenerator {

    center: Point;
    radius = 3;
    step = 0;

    light: Light;

    constructor(center: Point, radius: number) {
        super();
        this.center = center;
        this.radius = radius;
        
    }

    generate() {
        if (this.step == 0) {
            let ee = new ExplosionEffect();
            G.board.effects.addEffect(this.center, ee, true);
        }
        else { // .45 to make the circle look nice and also to make sur eit destroys all tiles
            for (let c of G.board.tiles.iterateCircumference(this.center, this.step +.45)) {
                if (G.board.tiles.hasPoint(c[0])) {
                    let ee = new ExplosionEffect();
                    G.board.effects.addEffect(c[0], ee, false);
                }
            }
        }

        if (this.step == this.radius)
            G.board.effects.removeGenerator(this);

        this.step++;
    }

}