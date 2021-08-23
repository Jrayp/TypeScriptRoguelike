import { Map, RNG } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import Digger from 'rot-js/lib/map/digger';
import Uniform from 'rot-js/lib/map/uniform';
import _Actor from './actors/_Actor';
import BoardLayer from './BoardLayer';
import { FloorTile } from './boardTiles/FloorTile';
import { PuddleTile } from './boardTiles/PuddleTile';
import { WallTile } from './boardTiles/WallTile';
import { _BoardTile } from './boardTiles/_BoardTile';
import C from './C';
import G from './G';
import Coords from './util/Coords';

export default class Board {
    tileLayer: BoardLayer<_BoardTile> = new BoardLayer<_BoardTile>();
    actorLayer: BoardLayer<_Actor> = new BoardLayer<_Actor>();
    lightLayer: BoardLayer<Color> = new BoardLayer<Color>();

    constructor() {
        this.generate();
    }

    draw(seenCells: Set<string>) {
        G.boardDisplay.update(this, seenCells);
    }


    generate() {
        let cavernUserCallback = (x: number, y: number, value: number) => {
            let newTile: _BoardTile;
            if (value == 1)
                newTile = new PuddleTile();
            else
                newTile = new WallTile();

            this.tileLayer.set(new Coords(x, y), newTile);
        }


        let cavernMap = new Map.Cellular(C.ARENA_WIDTH, C.ARENA_HEIGHT);
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
            if (value == 0) {
                newTile = new FloorTile()
                this.tileLayer.replace(new Coords(x, y), newTile);
            }

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

    coordsOnEdge(coords: Coords) {
        return coords.x == 0 || coords.x == C.ARENA_WIDTH - 1 || coords.y == 0 || coords.y == C.ARENA_HEIGHT - 1;
    }

    coordsWithinBounds(coords: Coords) {
        return coords.x >= 0 && coords.x < C.ARENA_WIDTH && coords.y >= 0 && coords.y < C.ARENA_HEIGHT;
    }

    numbersWithinBounds(x: number, y: number) {
        return x >= 0 && x < C.ARENA_WIDTH && y >= 0 && y < C.ARENA_HEIGHT;
    }

}