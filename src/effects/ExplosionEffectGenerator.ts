import Cell from "../util/Cell";
import G from "./../G";
import Sound from "./../audio/Sound";
import Light from "./../lights/Light";
import ExplosionEffect from "./ExplosionEffect";
import _EffectGenerator from "./_EffectGenerator";


export default class ExplosionEffectGenerator extends _EffectGenerator {

    center: Cell;
    radius = 3;
    step = 0;

    light: Light;

    sound: Sound;

    constructor(center: Cell, radius: number) {
        super();
        this.center = center;
        this.radius = radius;

        this.sound = new Sound('./../assets/audio/explosion.mp3', false, 50);
        this.sound._position = center;
        G.board.sounds.add(this.sound);
    }

    generate() {
        if (this.step == 0) {
            let ee = new ExplosionEffect();
            G.board.effects.addEffect(this.center, ee, true);
        }
        else { // .45 to make the circle look nice and also to make sure it destroys all tiles
            for (let c of G.board.tiles.iterateCircumference(this.center, this.step + .45)) {
                if (G.board.tiles.hasCell(c[0])) {
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