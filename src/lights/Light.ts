import { Color as ColorHelper, FOV, Lighting } from "rot-js";
import { Color } from 'rot-js/lib/color';
import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import Positional from "src/interfaces/Positional";
import C from "../C";
import G from "../G";
import Coords from "../util/Coords";

export default class Light {
    attachedTo: Positional;
    active = true;

    private _color: Color;
    private _intensity: number;
    private _lightCone: PreciseShadowcasting;
    private _lighting: Lighting;
    private _oldCoordsKey: string;

    constructor(attachedTo: Positional, intensity: number, color: Color) {
        this.attachedTo = attachedTo;
        this._intensity = intensity;
        this._color = color;

        this._lightCone = new FOV.PreciseShadowcasting(this.lightPassingCallback, { topology: 8 });
        this._lighting = new Lighting(this.reflectivityCallback, { range: this._intensity, passes: 2 })
            .setFOV(this._lightCone);
    }

    update() {
        if (this.active) {
            const coords = this.attachedTo.getCoords();
            if (coords && coords.key != this._oldCoordsKey)
                this.move(coords)
            this._lighting.compute(this.lightingCallback);
        }
    }

    extinguish(){
        this._lighting.clearLights();
    }

    updateFov() {
        this._lighting.setFOV(this._lightCone);
    }

    private move(coords: Coords) {
        this._lighting.clearLights();
        this._lighting.setLight(coords.x, coords.y, this._color);
    }
    private lightingCallback(x: number, y: number, color: Color) {
        G.board.lightManager.applyLight(x, y, color);
    }

    private lightPassingCallback(x: number, y: number) {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tileLayer.getElementViaKey(Coords.makeKey(x, y)).transparent;
    }

    private reflectivityCallback(x: number, y: number) {
        const key = Coords.makeKey(x, y);
        if (!G.board.numbersWithinBounds(x, y) || !G.board.tileLayer.getElementViaKey(key).passable)
            return 0;
        else
            return C.LIGHT_DEFAULT_REFLECTIVITY;
    }

}