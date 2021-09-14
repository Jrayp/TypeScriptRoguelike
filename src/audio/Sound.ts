import { Howl } from "howler";
import Point from "src/util/Point";
import IPositional from "./../interfaces/IPositional";

export default class Sound implements IPositional {

    _position: Point;
    sound: Howl;

    constructor(pos: Point) {
        this._position = pos;

        this.sound = new Howl({
            src: ['./../assets/audio/atmosbasement.mp3_.flac'],
            loop: true,
        });

        this.sound.pos(pos.x, pos.y, 0);
        this.sound.play();
    }

    get position(): Point | undefined {
        return this._position;
    }

}