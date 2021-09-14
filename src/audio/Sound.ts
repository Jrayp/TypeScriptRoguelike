import { Howl } from "howler";
import Cell from "src/util/Cell";
import IPositional from "./../interfaces/IPositional";

export default class Sound implements IPositional {

    _position: Cell;
    sound: Howl;

    constructor(pos: Cell) {
        this._position = pos;

        this.sound = new Howl({
            src: ['./../assets/audio/atmosbasement.mp3_.flac'],
            loop: true,
        });

        this.sound.pos(pos.x, pos.y, 0);
        this.sound.play();
    }

    get position(): Cell | undefined {
        return this._position;
    }

}