import { Color } from "rot-js/lib/color";
import Light from "./Light";

export default class LightManager {

    ambientLight: Color = [0, 0, 0];
    lightMap = new Map<string, Color>();

    private _lights = new Set<Light>();

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