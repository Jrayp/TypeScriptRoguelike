import { FOV, Lighting } from "rot-js";
import { Color } from 'rot-js/lib/color';
import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import IAttachable from "src/interfaces/IAttachable";
import C from "../C";
import G from "../G";
import Point from "../util/Point";
import { Layer } from "./../Enums";
import IActivatable from "./../interfaces/IActivatable";
import IPositional from "./../interfaces/IPositional";

export default class Light implements IActivatable, IAttachable {
    private _active = true;
    private _attachedTo: IPositional | undefined;

    private _color: Color;
    private _distance: number;
    private _lightCone: PreciseShadowcasting;
    private _lighting: Lighting;

    private _currentLayer: Layer;

    constructor(attachedTo: IPositional, intensity: number, color: Color) {
        this._attachedTo = attachedTo;
        this._distance = intensity;
        this._color = color;

        this._lightCone = new FOV.PreciseShadowcasting(this.lightPassingCallback, { topology: 8 });
        this._lighting = new Lighting(this.reflectivityCallback, { range: this._distance, passes: 2 })
            .setFOV(this._lightCone);
    }

    ///////////////////////////////////////////////////////
    // IActivatable
    ///////////////////////////////////////////////////////

    get isActive(): boolean {
        return this._active && this._attachedTo != undefined && this._attachedTo.position != undefined;
    }

    activate() {
        this._active = true;

    }
    deactivate() {
        this._active = false;
    }

    toggle() {
        this._active = !this._active;
        return this._active;
    }

    ///////////////////////////////////////////////////////
    // IAttachable
    ///////////////////////////////////////////////////////

    get attachedTo() {
        return this._attachedTo;
    }

    attach(positional: IPositional): void {
        this._attachedTo = positional;
    }

    detach(): void {
        this._attachedTo = undefined;
    }

    ///////////////////////////////////////////////////////
    // Update and Extinguish
    ///////////////////////////////////////////////////////

    update() {
        if (this.isActive) {
            this.reposition(this._attachedTo!.position!)
            this._lighting.setFOV(this._lightCone);
            this._lighting.compute(this.lightingCallback);
        }
    }

    extinguish() {
        this.deactivate();
        this._lighting.clearLights();
    }

    ///////////////////////////////////////////////////////
    // Private
    ///////////////////////////////////////////////////////

    private reposition(point: Point) {
        this._lighting.clearLights();
        this._lighting.setLight(point.x, point.y, this._color);
        this._currentLayer = this._attachedTo!.position!.layer;
    }

    private lightingCallback = (x: number, y: number, color: Color) => {
        G.board.lights.applyLight(x, y, this._currentLayer, color);
    }

    private lightPassingCallback = (x: number, y: number) => {
        if (!G.board.xyWithinBounds(x, y))
            return false;
        else {
            let tile = G.board.tiles.getElementViaXYZ(x, y, this._currentLayer);
            return tile.transparent;
        }
    }

    private reflectivityCallback = (x: number, y: number) => {
        if (!G.board.xyWithinBounds(x, y) || !G.board.tiles.getElementViaXYZ(x, y, this._currentLayer).transparent)
            return 0;
        else
            return C.LIGHT_DEFAULT_REFLECTIVITY;
    }

}