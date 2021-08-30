import { Map, RNG } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import Digger from 'rot-js/lib/map/digger';
import Uniform from 'rot-js/lib/map/uniform';
import { BorderTile } from './boardTiles/BorderTile';
import { CavernGrassTile } from './boardTiles/CavernGrassTile';
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
import G from './G';
import Coords from './util/Coords';

export default class Board {
    tiles = new TileController();
    actors = new ActorController();
    effects = new EffectsController();

    lights = new LightController();
    

    constructor() {
        // this.generate();
    }



    draw(seenCells: Set<string>, percievedOpaqueColors: Map<string, Color>) {
        G.boardDisplay.update(this, seenCells, percievedOpaqueColors);
    }

    generate() {
        let cavernUserCallback = (x: number, y: number, value: number) => {
            let newTile: _BoardTile;
            if (this.numbersOnEdge(x, y))
                newTile = new BorderTile();
            else if (value == 0)
                newTile = new WallTile();
            else if (value == 1)
                if (RNG.getUniform() < .025)
                    newTile = new GlowingCrystalTile();
                else
                    newTile = new WaterTile();


            this.tiles.set(new Coords(x, y), newTile!);
        }


        let cavernMap = new Map.Cellular(C.BOARD_WIDTH, C.BOARD_HEIGHT);
        cavernMap.randomize(.4);
        for (var i = 0; i < 3; i++) {
            cavernMap.create();
        }

        cavernMap.create(cavernUserCallback);

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        let structuredUserCallback = (x: number, y: number, value: number) => {
            let newTile: _BoardTile;
            if (value == 0 && !this.numbersOnEdge(x, y) && this.tiles.getElementViaKey(Coords.makeKey(x, y)).name != "Glowing Crystal") {
                newTile = new FloorTile()
                this.tiles.replace(new Coords(x, y), newTile);
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
            if (value == 1 && this.tiles.getElementViaKey(Coords.makeKey(x, y)).name == "Floor") {
                newTile = new CavernGrassTile();
                this.tiles.replace(new Coords(x, y), newTile);
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

    coordsOnEdge(coords: Coords) {
        return coords.x == 0 || coords.x == C.BOARD_WIDTH - 1 || coords.y == 0 || coords.y == C.BOARD_HEIGHT - 1;
    }

    numbersOnEdge(x: number, y: number) {
        return x == 0 || x == C.BOARD_WIDTH - 1 || y == 0 || y == C.BOARD_HEIGHT - 1;
    }

    coordsWithinBounds(coords: Coords) {
        return coords.x >= 0 && coords.x < C.BOARD_WIDTH && coords.y >= 0 && coords.y < C.BOARD_HEIGHT;
    }

    numbersWithinBounds(x: number, y: number) {
        return x >= 0 && x < C.BOARD_WIDTH && y >= 0 && y < C.BOARD_HEIGHT;
    }

}