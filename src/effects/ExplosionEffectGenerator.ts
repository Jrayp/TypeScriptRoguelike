import Coords from "../util/Coords";
import G from "./../G";
import _EffectGenerator from "./_EffectGenerator";
import ExplosionEffect from "./ExplosionEffect";
import Light from "src/lights/Light";


export default class ExplosionGenerator extends _EffectGenerator {

    center: Coords;
    radius = 3;
    step = 0;

    light: Light;

    constructor(center: Coords, radius: number) {
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
                if (G.board.tiles.hasCoords(c[0])) {
                    let ee = new ExplosionEffect();
                    G.board.effects.addEffect(c[0], ee, true);
                }
            }
        }

        if (this.step == this.radius)
            G.board.effects.removeGenerator(this);

        this.step++;
    }

}