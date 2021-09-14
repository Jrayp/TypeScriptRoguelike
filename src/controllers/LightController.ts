import { Color as ColorHelper } from "rot-js";
import { Color } from "rot-js/lib/color";
import ISight from "../interfaces/ISight";
import Point from "../util/Point";
import { _BoardTile } from "./../boardTiles/_BoardTile";
import { Layer } from "src/Enums";
import G from "./../G";
import Light from "./../lights/Light";
import GMath from "./../util/GMath";

export default class LightController {

    baseColor: Color = [0, 0, 0];

    private _lights = new Set<Light>();
    private _colorMap = new Map<Point, Color>();
    private _brightnessMap = new Map<Point, number>();

    ///////////////////////////////////////////////////////
    // Updating
    ///////////////////////////////////////////////////////

    update() {
        this._colorMap.clear();
        this._brightnessMap.clear();
        for (let light of this._lights) {
            light.update();
        }
    }

    ///////////////////////////////////////////////////////
    // Light Object Management
    ///////////////////////////////////////////////////////

    addLight(light: Light) {
        this._lights.add(light);
    }

    removeLight(light: Light) {
        light.extinguish();
        this._lights.delete(light);
    }

    ///////////////////////////////////////////////////////
    // Colors & Brightness retrieval
    ///////////////////////////////////////////////////////

    getColor(point: Point) {
        return this._colorMap.get(point);
    }

    getBrightness(point: Point) {
        return this._brightnessMap.get(point);
    }

    ///////////////////////////////////////////////////////
    // Light & Brightness application
    ///////////////////////////////////////////////////////

    // TODO: Just make the light not shine on the wall if the player cant see the neighboring
    // floor tiles..

    applyLight(x: number, y: number, layer: Layer, lightColor: Color) {
        let point = Point.get(x, y, layer)!;
        let tile = G.board.tiles.getElementViaPoint(point);

        // Opaque tiles don't really need brightness given the way we currently draw them, 
        // but we need a value here so that the tile is picked up by the players FOV alg. 
        // Yes its a hack for now
        if (!tile.transparent) {
            this._brightnessMap.set(point, -1);
            return;
        }

        let newColor: Color;
        let existingColor = this._colorMap.get(point);

        if (existingColor) {
            newColor = ColorHelper.add(existingColor, lightColor);
            this._colorMap.set(point, newColor)
        }
        else {
            newColor = ColorHelper.add(this.baseColor, lightColor);
            this._colorMap.set(point, newColor);
        }

        let brightness = (newColor[0] + newColor[1] + newColor[2]) / 3;
        brightness = GMath.normalize(brightness, 0, 255, 0, 10);
        this._brightnessMap.set(point, brightness);
    }

    percievedLightColorOfOpaque(opaqueTile: _BoardTile, sight: ISight) {
        let tilePos = opaqueTile.position;
        let brightestNeighborColor: Color | undefined = undefined;
        let highestBrightness = 0;

        let surroundingTiles = G.board.tiles.iterateSurroundingPlane(tilePos);
        for (let neighborPointAndTile of surroundingTiles) {
            let point = neighborPointAndTile[0]!;
            let tile = neighborPointAndTile[1]!;
            if (tile.transparent) {
                let inFov = sight.seenPoints.has(point);
                if (inFov) {
                    let brightness = this._brightnessMap.get(point) || 0;
                    if (brightness > highestBrightness) {
                        brightestNeighborColor = this._colorMap.get(point)!;
                        highestBrightness = brightness;
                    }
                }
            }
        }

        return brightestNeighborColor;
    }
}