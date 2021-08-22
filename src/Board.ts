import { Map, RNG } from 'rot-js';
import _Actor from './actors/_Actor';
import { FloorTile } from './boardTiles/FloorTile';
import { WallTile } from './boardTiles/WallTile';
import { PuddleTile } from './boardTiles/PuddleTile';
import { _BoardTile } from './boardTiles/_BoardTile';
import C from './C'
import BoardDisplay from './displays/BoardDisplay';
import BoardLayer from './BoardLayer';
import G from './G';
import Uniform from 'rot-js/lib/map/uniform';
import Digger from 'rot-js/lib/map/digger';

export default class Board {
    tileLayer: BoardLayer<_BoardTile> = new BoardLayer<_BoardTile>();
    actorLayer: BoardLayer<_Actor> = new BoardLayer<_Actor>();

    constructor() {
        this.generate();
    }

    draw(gameDisplay: BoardDisplay) {
        G.BoardDisplay.update(this);
    }


    generate() {
        // let cavernUserCallback = (x: number, y: number, value: number) => {
        //     let coord = Board.makeCoord(x, y);
        //     let newTile: _BoardTile;
        //     if (value == 1)
        //         newTile = new PuddleTile();
        //     else
        //         newTile = new WallTile();

        //     this.tileLayer.set(coord, newTile);
        // }


        // let cavernMap = new Map.Cellular(C.ARENA_WIDTH, C.ARENA_HEIGHT);
        // cavernMap.randomize(.4);
        // for (var i = 0; i < 3; i++) {
        //     cavernMap.create();
        // }

        // cavernMap.create(cavernUserCallback);

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        let structuredUserCallback = (x: number, y: number, value: number) => {
            let coord = Board.makeCoord(x, y);
            let newTile: _BoardTile;
            if (value == 0) {
                newTile = new FloorTile()
            }
            else
                newTile = new WallTile();
            // TODO: Causes assertion errors if we overwrite cavern tiles
            this.tileLayer.set(coord, newTile);
        }



        let structuredMap: Digger | Uniform;

        if (RNG.getUniform() < .5)
            structuredMap = new Map.Uniform(C.ARENA_WIDTH, C.ARENA_HEIGHT, { roomWidth: [3, 7], roomHeight: [3, 7], roomDugPercentage: .1 });
        else
            structuredMap = new Map.Digger(C.ARENA_WIDTH, C.ARENA_HEIGHT, { roomWidth: [3, 7], roomHeight: [3, 7], corridorLength: [1, 12] });

        structuredMap.create(structuredUserCallback);


    }


    ///////////////////////////////////////////////////////
    // Static
    ///////////////////////////////////////////////////////

    static convert1Dto2D(p: number): [number, number] {

        let x = p % C.ARENA_WIDTH;
        let y = Math.trunc(p / C.ARENA_WIDTH);
        return [x, y];
    }

    static convert2Dto1D(x: number, y: number) {
        return x + C.ARENA_WIDTH * y;

    }

    static makeCoord(x: number, y: number): [number, number, string] {
        return [x, y, x + ',' + y];
    }

    static isEdge(x: number, y: number) {
        return x == 0 || x == C.ARENA_WIDTH - 1 || y == 0 || y == C.ARENA_HEIGHT - 1;
    }
}