import { Color as ColorHelper } from "rot-js";
import { Color } from "rot-js/lib/color";
import { _BoardTile } from "./../boardTiles/_BoardTile";
import G from "./../G";
import ISight from "../interfaces/ISight";
import Point from "../util/Point";
import GMath from "./../util/GMath";
import Light from "./../lights/Light";
import { Layer } from "./../Enums";

export default class LightController {

    ambientLight: Color = [0, 0, 0];

    private _lights = new Set<Light>();
    private _colorMap = new Map<Point, Color>();
    private _brightnessMap = new Map<Point, number>();

    getColor(point: Point) {
        return this._colorMap.get(point);
    }

    getBrightness(point: Point) {
        return this._brightnessMap.get(point);
    }

    addLight(light: Light) {
        this._lights.add(light);
    }

    removeLight(light: Light) {
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

    // TODO: Just make the light not shine on the wall if the player cant see the neighboring
    // floor tiles..

    applyLight(x: number, y: number, layer: Layer, lightColor: Color) {
        if (!G.board.xyWithinBounds(x, y))
            return;

        let point = Point.get(x, y, layer)!;
        let tile = G.board.tiles.getElementViaPoint(point);
        // Wall tiles don't really need brightness given the way we currently draw them, 
        // but we need a value here so that the tile is picked up by the players FOV alg. 
        // Yes its a hack for now
        if (!tile.transparent) {
            this._brightnessMap.set(point, -1);
            return;
        }

        let newLight: Color;
        if (this._colorMap.has(point)) {
            let oldLight = this._colorMap.get(point)!;
            newLight = ColorHelper.add(oldLight, lightColor);
            this._colorMap.set(point, newLight)
        }
        else {
            newLight = ColorHelper.add(this.ambientLight, lightColor);
            this._colorMap.set(point, newLight);
        }

        let brightness = (newLight[0] + newLight[1] + newLight[2]) / 3;
        brightness = GMath.normalize(brightness, 0, 255, 0, 10);
        this._brightnessMap.set(point, brightness);
    }

    percievedLightColorOfOpaque(opaqueTile: _BoardTile, sight: ISight) {
        let tilePoint = opaqueTile.position;
        let brightestNeighborColor: Color | undefined = undefined;
        let highestBrightness = 0;
        let generator = G.board.tiles.iterateSurroundingPlane(tilePoint);
        for (let neighborPointAndTile of generator) {
            if (neighborPointAndTile[1]?.transparent) {
                let inFov = sight.seenPoints.has(neighborPointAndTile[0]);
                if (inFov) {
                    let brightness = this._brightnessMap.get(neighborPointAndTile[0]) || 0;
                    if (brightness > highestBrightness) {
                        brightestNeighborColor = this._colorMap.get(neighborPointAndTile[0])!;
                        highestBrightness = brightness;
                    }
                }
            }
        }
        return brightestNeighborColor;
    }
}