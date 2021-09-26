// import { Howl } from "howler";
import IAttachable from "src/interfaces/IAttachable";
import Cell from "src/util/Cell";
import IPositional from "./../interfaces/IPositional";
// import  * as Pizzicato from "../../node_modules/pizzicato/src/Pizzicato.js"
import * as Pizzicato from 'pizzicato';
import G from "./../G";

export default class Sound implements IAttachable, IPositional {

    _position: Cell;
    // sound: Howl;

    lowPassFilter: any;
    stereoPanner: any;

    soundEffect: any;

    intensity: number;

    _attachedTo: IPositional | undefined;

    constructor(path: string, loop: boolean, intensity: number, attachedTo: IPositional | undefined = undefined) {
        // this._position = pos;
        this._attachedTo = attachedTo;
        this.intensity = intensity;
        // this.sound = new Howl({
        //     src: ['./../assets/audio/bbc_d-i-y--and_07045165.mp3'],
        //     loop: true,
        // });

        // this.sound.pos(pos.x, pos.y, 0);
        // this.sound.play();


        this.stereoPanner = new Pizzicato.Effects.StereoPanner({
            pan: 0.0
        });

        this.lowPassFilter = new Pizzicato.Effects.LowPassFilter({
            frequency: 22050,
            peak: 0.0001
        });

        var sound = new Pizzicato.Sound({
            source: 'file',
            options: {
                path: path,
                loop: loop
            }
        }, function () {
            sound.play();
        });

        this.soundEffect = sound;

        this.soundEffect.addEffect(this.lowPassFilter);
        this.soundEffect.addEffect(this.stereoPanner);

        if (!loop)
            this.soundEffect.on('end', this.destroy);

    }
    get position(): Cell | undefined {
        if (this._attachedTo)
            return this._attachedTo.position!;
        else
            return this._position;
    }

    // onLoad() {
    //     this.soundEffect.play();
    // }

    get attachedTo() {
        return this._attachedTo;
    }

    attach(positional: IPositional): void {
        this._attachedTo = positional;
    }

    detach(): void {
        this._attachedTo = undefined;
    }

    destroy = () => {
        this.detach();
        this.soundEffect.disconnect();
        G.board.sounds.remove(this);
    }
}