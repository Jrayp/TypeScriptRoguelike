import { Map, RNG } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import Digger from 'rot-js/lib/map/digger';
import Uniform from 'rot-js/lib/map/uniform';
import { BorderTile } from './boardTiles/BorderTile';
import { CavernGrassTile } from './boardTiles/CavernGrassTile';
import CoralTile from './boardTiles/CoralTile';
import { FloorTile } from './boardTiles/FloorTile';
import { GlowingCrystalTile } from './boardTiles/GlowingCrystalTile';
import { WallTile } from './boardTiles/WallTile';
import { WaterTile } from './boardTiles/WaterTile';
import { _BoardTile } from './boardTiles/_BoardTile';
import C from './C';
import ActorController from './controllers/ActorController';
import EffectsController from './controllers/EffectsController';
import LightController from './controllers/LightController';
import TileController from './controllers/TileController';
import UIController from './controllers/UIController';
import { Layer } from './Enums';
import G from './G';
import Point from './util/Point';

export default class Board {
    tiles = new TileController();
    actors = new ActorController();
    effects = new EffectsController();
    icons = new UIController();

    lights = new LightController();

    constructor() {
    }

    draw(seenCells: Set<number>, percievedOpaqueColors: Map<number, Color>) {
        G.boardDisplay.update(this, seenCells, percievedOpaqueColors);
    }

    generate() {
        let cavernUserCallback = (x: number, y: number, value: number) => {
            let newTile: _BoardTile;
            let newWaterTile: _BoardTile;
            if (this.numbersOnEdge(x, y)) {
                newTile = new BorderTile();
                newWaterTile = new BorderTile();
            }
            else if (value == 0) {
                newTile = new WallTile();
                newWaterTile = new WallTile();
            }
            else if (value == 1)
                if (RNG.getUniform() < .025) {
                    newTile = new GlowingCrystalTile();
                    newWaterTile = new WaterTile();
                }
                else {
                    newTile = new WaterTile();
                    if (RNG.getUniform() < .02)
                        newWaterTile = new CoralTile();
                    else newWaterTile = new WaterTile();
                }


            this.tiles.set(new Point(x, y, Layer.ABOVE), newTile!);
            this.tiles.set(new Point(x, y, Layer.BELOW), newWaterTile!);
        }


        let cavernUserCallback2 = (x: number, y: number, value: number) => {
            let newWaterTile: _BoardTile;
            if (this.numbersOnEdge(x, y)) {
                return;
            }
            else if (value == 0) {
                return;
            }
            else if (value == 1)
                if (RNG.getUniform() < .001) {
                    newWaterTile = new GlowingCrystalTile();
                }
                else {
                    if (RNG.getUniform() < .02)
                        newWaterTile = new CoralTile();
                    else newWaterTile = new WaterTile();
                }

            this.tiles.replace(new Point(x, y, Layer.BELOW), newWaterTile!);
        }

        let cavernMap = new Map.Cellular(C.BOARD_WIDTH, C.BOARD_HEIGHT);
        cavernMap.randomize(.4);
        for (var i = 0; i < 5; i++) {
            cavernMap.create();
        }

        cavernMap.create(cavernUserCallback);

        cavernMap = new Map.Cellular(C.BOARD_WIDTH, C.BOARD_HEIGHT);
        cavernMap.randomize(.5);
        for (var i = 0; i < 3; i++) {
            cavernMap.create();
        }

        cavernMap.create(cavernUserCallback2);


        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        let structuredUserCallback = (x: number, y: number, value: number) => {
            let newTile: _BoardTile;
            if (value == 0 && !this.numbersOnEdge(x, y) && this.tiles.getElementViaKey(Point.toKey(x, y, Layer.ABOVE)).name != "Glowing Crystal") {
                newTile = new FloorTile()
                this.tiles.replace(new Point(x, y, Layer.ABOVE), newTile);
            }

        }

        let structuredMap: Digger | Uniform;

        if (RNG.getUniform() < .5)
            structuredMap = new Map.Uniform(C.BOARD_WIDTH, C.BOARD_HEIGHT, { roomWidth: [3, 7], roomHeight: [3, 7], roomDugPercentage: .1 });
        else
            structuredMap = new Map.Digger(C.BOARD_WIDTH, C.BOARD_HEIGHT, { roomWidth: [3, 7], roomHeight: [3, 7], corridorLength: [1, 12] });

        structuredMap.create(structuredUserCallback);

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        let vegetationUserCallback = (x: number, y: number, value: number) => {
            let newTile: _BoardTile;
            if (value == 1 && this.tiles.getElementViaKey(Point.toKey(x, y, Layer.ABOVE)).name == "Floor") {
                newTile = new CavernGrassTile();
                this.tiles.replace(new Point(x, y, Layer.ABOVE), newTile);
            }

        }


        let vegetationMap = new Map.Cellular(C.BOARD_WIDTH, C.BOARD_HEIGHT);
        vegetationMap.randomize(.5);
        for (var i = 0; i < 3; i++) {
            vegetationMap.create();
        }

        vegetationMap.create(vegetationUserCallback);

    }



    ///////////////////////////////////////////////////////
    // Static
    ///////////////////////////////////////////////////////

    pointOnEdge(point: Point) {
        return point.x == 0 || point.x == C.BOARD_WIDTH - 1 || point.y == 0 || point.y == C.BOARD_HEIGHT - 1;
    }

    numbersOnEdge(x: number, y: number) {
        return x == 0 || x == C.BOARD_WIDTH - 1 || y == 0 || y == C.BOARD_HEIGHT - 1;
    }

    pointWithinBounds(point: Point) {
        return point.x >= 0 && point.x < C.BOARD_WIDTH && point.y >= 0 && point.y < C.BOARD_HEIGHT;
    }

    xyWithinBounds(x: number, y: number) {
        return x >= 0 && x < C.BOARD_WIDTH && y >= 0 && y < C.BOARD_HEIGHT;
    }

}