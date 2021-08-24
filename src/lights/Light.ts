import { Color as ColorHelper, FOV, Lighting } from "rot-js";
import { Color } from 'rot-js/lib/color';
import Positional from "src/interfaces/Positional";
import C from "../C";
import G from "../G";
import Coords from "../util/Coords";


// TODO: Use the method in the example: It allows us to automatically adjust tile colors all over
// Remember, idiot

export default class Light {

    // TODO: Should this be here? Prob not
    static ambientLight: Color = [0, 0, 0];

    intensity = 8;
    color: Color = [155, 155, 155];

    private _lightCone = new FOV.PreciseShadowcasting(this.lightPassingCallback, { topology: 8 });
    private _lighting = new Lighting(this.reflectivityCallback, { range: this.intensity, passes: 2 })
        .setFOV(this._lightCone);

    attachedTo: Positional;
    oldCoordsKey: string;

    constructor(attachedTo: Positional, color: Color = [155, 155, 155]) {
        const coords = attachedTo.getCoords();
        this.attachedTo = attachedTo;
        this.color = color;
        if (coords) {
            this.oldCoordsKey = coords.key;
            this._lighting.setLight(coords.x, coords.y, this.color);
        }
        else {
            this.oldCoordsKey = "xx";
        }
    }

    update() {
        const coords = this.attachedTo.getCoords();
        if (coords) {
            if (coords.key != this.oldCoordsKey)
                this.move(coords)

            this._lighting.compute(this.lightingCallback);
        }
    }

    private move(coords: Coords) {
        this._lighting.clearLights();
        this._lighting.setLight(coords.x, coords.y, this.color);
    }

    private lightingCallback(x: number, y: number, color: Color) {
        const key = new Coords(x, y).key;

        if (G.board.lightManager._lightMap.has(key)) {
            let oldLight = G.board.lightManager._lightMap.get(key)!;
            let newLight = ColorHelper.add(oldLight, color);
            G.board.lightManager._lightMap.set(key, newLight)
        }
        else {
            let newLight = ColorHelper.add(Light.ambientLight, color);
            G.board.lightManager._lightMap.set(key, newLight);
        }
    }

    private lightPassingCallback(x: number, y: number) {
        const key = Coords.makeKey(x, y);
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tileLayer.getElementViaKey(key).transparent;
    }

    private reflectivityCallback(x: number, y: number) {
        const key = Coords.makeKey(x, y);
        if (!G.board.numbersWithinBounds(x, y) || !G.board.tileLayer.getElementViaKey(key).passable)
            return 0;
        else
            return C.LIGHT_DEFAULT_REFLECTIVITY;
    }

}