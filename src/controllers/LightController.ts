import { Color as ColorHelper } from "rot-js";
import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./../boardTiles/_BoardTile";
import G from "./../G";
import ISight from "../interfaces/ISight";
import Point from "../util/Point";
import GMath from "./../util/GMath";
import Light from "./../lights/Light";

export default class LightController {

    ambientLight: Color = [0, 0, 0];

    private _lights = new Set<Light>();
    private _colorMap = new Map<number, Color>();
    private _brightnessMap = new Map<number, number>();

    getColor(key: number) {
        return this._colorMap.get(key);
    }

    getBrightness(key: number) {
        return this._brightnessMap.get(key);
    }

    addLight(light: Light) {
        this._lights.add(light);
    }

    removeLight(light: Light) {
        light.active = false;
        light.extinguish();
        this._lights.delete(light);
    }

    update() {
        this._colorMap.clear();
        this._brightnessMap.clear();
        for (let light of this._lights) {
            light.update();
        }
    }

    updateFov() {
        for (let light of this._lights) {
            light.updateFov();
        }
    }

    // TODO: Just make the light not shine on the wall if the player cant see the neighboring
    // floor tiles..

    applyLight(x: number, y: number, z: number, lightColor: Color) {
        if (!G.board.numbersWithinBounds(x, y))
            return;

        const key = new Point(x, y, z).key;
        let tile = G.board.tiles.getElementViaKey(key);
        // Wall tiles don't really need brightness given the way we currently draw them, 
        // but we need a value here so that the tile is picked up by the players FOV alg. 
        // Yes its a hack for now
        if (!tile.transparent) {
            this._brightnessMap.set(key, -1);
            return;
        }

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

    percievedLightColorOfOpaque(opaqueTile: _BoardTile, sight: ISight) {
        let tilePoint = opaqueTile.position;
        let brightestNeighborColor: Color | undefined = undefined;
        let highestBrightness = 0;
        let generator = G.board.tiles.iterateSurrounding(tilePoint);
        for (let neighborPointAndTile of generator) {
            if (neighborPointAndTile[1]?.transparent) {
                let key = neighborPointAndTile[0].key;
                let inFov = sight.seenPoints.has(key);
                if (inFov) {
                    let brightness = this._brightnessMap.get(key) || 0;
                    if (brightness > highestBrightness) {
                        brightestNeighborColor = this._colorMap.get(key)!;
                        highestBrightness = brightness;
                    }
                }
            }
        }
        return brightestNeighborColor;
    }
}