import { Color } from "rot-js/lib/color";
import Light from "./Light";

export default class LightManager {

    lights = new Set<Light>();
    lightMap = new Map<string, Color>();

    update(){
        this.lightMap.clear();
        for(let light of this.lights){
            light.update();
        }
    }


}