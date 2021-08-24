import { Color } from "rot-js/lib/color";
import Drawable from "src/interfaces/Drawable";
import Positional from "src/interfaces/Positional";
import Light from "./Light";

export default class LightManager {

    ambientLight: Color = [0, 0, 0];

    private _lights = new Set<Light>();
    lightMap = new Map<string, Color>();

    getValueAt(key: string) {
        return this.lightMap.get(key);
    }

    update() {
        this.lightMap.clear();
        for (let light of this._lights) {
            light.update();
        }
    }

    addLight(light: Light) {
        this._lights.add(light);
    }


}