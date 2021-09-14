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
import AudioController from './controllers/AudioController';
import EffectsController from './controllers/EffectsController';
import LightController from './controllers/LightController';
import GraphController from './controllers/GraphController';
import TileController from './controllers/TileController';
import UIController from './controllers/UIController';
import { Layer } from './Enums';
import G from './G';
import Cell from './util/Cell';

export default class Board {
    tiles = new TileController();
    actors = new ActorController();
    effects = new EffectsController();
    icons = new UIController();

    lights = new LightController();

    sounds = new AudioController();

    graph = new GraphController();

    constructor() {
    }

    generate() {
        let cavernUserCallback = (x: number, y: number, value: number) => {
            let newTile: _BoardTile;
            let newWaterTile: _BoardTile;
            if (Cell.xyOnEdge(x, y)) {
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


            this.tiles.set(Cell.get(x, y, Layer.ABOVE)!, newTile!);
            this.tiles.set(Cell.get(x, y, Layer.BELOW)!, newWaterTile!);
        }


        let cavernUserCallback2 = (x: number, y: number, value: number) => {
            let newWaterTile: _BoardTile;
            if (Cell.xyOnEdge(x, y)) {
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

            this.tiles.replace(Cell.get(x, y, Layer.BELOW)!, newWaterTile!);
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
            let cell = Cell.get(x, y, Layer.ABOVE)!;
            if (value == 0 && !cell.onEdge() && this.tiles.getElementViaCell(cell).name != "Glowing Crystal") {
                newTile = new FloorTile()
                this.tiles.replace(Cell.get(x, y, Layer.ABOVE)!, newTile);
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
            if (value == 1 && this.tiles.getElementViaXYZ(x, y, Layer.ABOVE).name == "Floor") {
                newTile = new CavernGrassTile();
                this.tiles.replace(Cell.get(x, y, Layer.ABOVE)!, newTile);
            }

        }


        let vegetationMap = new Map.Cellular(C.BOARD_WIDTH, C.BOARD_HEIGHT);
        vegetationMap.randomize(.5);
        for (var i = 0; i < 3; i++) {
            vegetationMap.create();
        }

        vegetationMap.create(vegetationUserCallback);

    }

}