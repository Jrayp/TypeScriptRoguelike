import * as Pizzicato from 'pizzicato';
import IAttachable from "src/interfaces/IAttachable";
import Cell from "src/util/Cell";
import G from "./../G";
import IPositional from "./../interfaces/IPositional";

export default class Sound implements IAttachable, IPositional {

    readonly resourceFolderPath = './../assets/audio/';

    _position: Cell;

    stereoPanner: any;
    lowPassFilter: any;

    pizzicatoSound: any;

    intensity: number;

    _attachedTo: IPositional | undefined;

    constructor(resourceName: string, loop: boolean, intensity: number, attachedTo: IPositional | undefined = undefined) {
        this._attachedTo = attachedTo;
        this.intensity = intensity;

        this.stereoPanner = new Pizzicato.Effects.StereoPanner({
            pan: 0.0
        });

        this.lowPassFilter = new Pizzicato.Effects.LowPassFilter({
            frequency: 22050,
            peak: 0.0001
        });

        this.pizzicatoSound = new Pizzicato.Sound({
            source: 'file',
            options: {
                path: this.resourceFolderPath + resourceName,
                loop: loop
            }
        }, this.onLoad.bind(this));

        this.pizzicatoSound.addEffect(this.lowPassFilter);
        this.pizzicatoSound.addEffect(this.stereoPanner);

        if (!loop)
            this.pizzicatoSound.on('end', this.destroy.bind(this));

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

    onLoad() {
        this.pizzicatoSound.play();
    }

    destroy() {
        this.detach();
        this.pizzicatoSound.disconnect();
        G.board.sounds.remove(this);
    }
}