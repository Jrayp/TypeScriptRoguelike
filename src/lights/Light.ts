import { Color as ColorHelper, FOV, Lighting } from "rot-js";
import { Color } from 'rot-js/lib/color';
import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import IActivatable from "./../interfaces/IActivatable";
import IPositional from "./../interfaces/IPositional";
import C from "../C";
import G from "../G";
import Coords from "../util/Coords";

export default class Light implements IActivatable {
    attachedTo: IPositional;
    active = true;

    private _color: Color;
    private _intensity: number;
    private _lightCone: PreciseShadowcasting;
    private _lighting: Lighting;
    private _oldCoordsKey: number;

    constructor(attachedTo: IPositional, intensity: number, color: Color) {
        this.attachedTo = attachedTo;
        this._intensity = intensity;
        this._color = color;

        this._lightCone = new FOV.PreciseShadowcasting(this.lightPassingCallback, { topology: 8 });
        this._lighting = new Lighting(this.reflectivityCallback, { range: this._intensity, passes: 2 })
            .setFOV(this._lightCone);
    }


    // TODO: Could probably be made into helper functions
    // activate(): void {
    //     this.active = true;
    // }
    // deactivate(): void {
    //     this.active = false;
    // }
    // toggleActive(): boolean {
    //     return this.active = !this.active;
    // }

    update() {
        if (this.active) {
            const coords = this.attachedTo.coords;
            if (coords && coords.key != this._oldCoordsKey)
                this.move(coords)
            this._lighting.compute(this.lightingCallback);
        }
    }

    extinguish() {
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
        G.board.lights.applyLight(x, y, color);
    }

    private lightPassingCallback(x: number, y: number) {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tiles.getElementViaKey(Coords.toInt(x, y)).transparent;
    }

    private reflectivityCallback(x: number, y: number) {
        const key = Coords.toInt(x, y);
        if (!G.board.numbersWithinBounds(x, y) || !G.board.tiles.getElementViaKey(key).passable)
            return 0;
        else
            return C.LIGHT_DEFAULT_REFLECTIVITY;
    }

}