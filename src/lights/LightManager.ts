import { Color } from "rot-js/lib/color";
import Drawable from "src/interfaces/Drawable";
import Positional from "src/interfaces/Positional";
import Light from "./Light";

export default class LightManager {

    private _lights = new Set<Light>();
    _lightMap = new Map<string, Color>();

    getValueAt(key: string) {
        return this._lightMap.get(key);
    }

    update() {
        this._lightMap.clear();
        for (let light of this._lights) {
            light.update();
        }
    }

    addLight(light: Light) {
        this._lights.add(light);
    }


}