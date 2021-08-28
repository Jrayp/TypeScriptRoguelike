import { Color } from "rot-js/lib/color";
import Coords from "./../util/Coords";
import Light from "./Light";
import { Color as ColorHelper, FOV, Lighting } from "rot-js";
import GMath from "./../util/GMath";
import Sight from "./../interfaces/Sight";
import { _BoardTile } from "./../boardTiles/_BoardTile";
import G from "./../G";

export default class LightManager {

    ambientLight: Color = [0, 0, 0];
    private _colorMap = new Map<string, Color>();
    private _brightnessMap = new Map<string, number>();

    private _lights = new Set<Light>();

    getColor(key: string) {
        return this._colorMap.get(key);
    }

    getBrightness(key: string) {
        return this._brightnessMap.get(key);
    }

    update() {
        this._colorMap.clear();
        this._brightnessMap.clear();
        for (let light of this._lights) {
            light.update();
        }
    }

    addLight(light: Light) {
        this._lights.add(light);
    }

    applyLight(x: number, y: number, lightColor: Color) {
        const key = new Coords(x, y).key;

        let newLight: Color;
        if (this._colorMap.has(key)) {
            let oldLight = this._colorMap.get(key)!;
            newLight = ColorHelper.add(oldLight, lightColor);
            this._colorMap.set(key, newLight)
        }
        else {
            newLight = ColorHelper.add(this.ambientLight, lightColor);
            this._colorMap.set(key, newLight);
        }

        let brightness = (newLight[0] + newLight[1] + newLight[2]) / 3;
        brightness = GMath.normalize(brightness, 0, 255, 0, 10);
        this._brightnessMap.set(key, brightness);
    }

    percievedLightColorOfOpaque(opaqueTile: _BoardTile, sight: Sight) {
        let tileCoords = opaqueTile.getCoords();
        let objectiveBrightness = this._brightnessMap.get(tileCoords.key) || 0;

        let brightestNeighborColor: Color | undefined = undefined;
        let highestBrightness = 0;
        let generator = G.board.tileLayer.iterateSurrounding(tileCoords);
        for (let neighborCoordsAndTile of generator) {
            if (neighborCoordsAndTile[1]?.transparent) {
                let key = neighborCoordsAndTile[0].key;
                let inFov = sight.currentlySeenCoordKeys.has(key);
                if (inFov) {
                    let brightness = this._brightnessMap.get(key) || 0;
                    if (brightness > highestBrightness) {
                        brightestNeighborColor = this._colorMap.get(key)!;
                        highestBrightness = brightness;
                    }
                }
            }
        }
        // Return the objective color, or the color of neighbor with highest brightness. Whichever is less
        return objectiveBrightness < highestBrightness ? this._colorMap.get(tileCoords.key) || undefined : brightestNeighborColor;
    }
}