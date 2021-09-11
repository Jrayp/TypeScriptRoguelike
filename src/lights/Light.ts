import { FOV, Lighting } from "rot-js";
import { Color } from 'rot-js/lib/color';
import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import C from "../C";
import G from "../G";
import Point from "../util/Point";
import IActivatable from "./../interfaces/IActivatable";
import IPositional from "./../interfaces/IPositional";

export default class Light implements IActivatable {
    attachedTo: IPositional;
    active = true;

    private _color: Color;
    private _intensity: number;
    private _lightCone: PreciseShadowcasting;
    private _lighting: Lighting;
    private _oldPointKey: number;

    constructor(attachedTo: IPositional, intensity: number, color: Color) {
        this.attachedTo = attachedTo;
        this._intensity = intensity;
        this._color = color;

        this._lightCone = new FOV.PreciseShadowcasting(this.lightPassingCallback, { topology: 8 });
        this._lighting = new Lighting(this.reflectivityCallback, { range: this._intensity, passes: 2 })
            .setFOV(this._lightCone);
    }

    update() {
        if (this.active) {
            const position = this.attachedTo.position;
            if (position && position.key != this._oldPointKey)
                this.move(position)
            this._lighting.compute(this.lightingCallback);
        }
    }

    extinguish() {
        this._lighting.clearLights();
    }

    updateFov() {
        this._lighting.setFOV(this._lightCone);
    }

    private move(point: Point) {
        this._lighting.clearLights();
        this._lighting.setLight(point.x, point.y, this._color);
    }

    private lightingCallback = (x: number, y: number, color: Color) => {
        G.board.lights.applyLight(x, y, this.attachedTo.position!.layer, color);
    }

    private lightPassingCallback = (x: number, y: number) => {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else {
            let t = G.board.tiles.getElementViaKey(Point.toKey(x, y, this.attachedTo.position!.layer));
            return t.transparent;
        }
    }

    private reflectivityCallback = (x: number, y: number) => {
        const key = Point.toKey(x, y, this.attachedTo.position!.layer);
        if (!G.board.numbersWithinBounds(x, y) || !G.board.tiles.getElementViaKey(key).transparent)
            return 0;
        else
            return C.LIGHT_DEFAULT_REFLECTIVITY;
    }

}