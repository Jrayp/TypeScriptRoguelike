import { Map, RNG } from 'rot-js';
import Actor from './actors/_Actor';
import { FloorTile } from './boardTiles/FloorTile';
import { WallTile } from './boardTiles/WallTile';
import { PuddleTile } from './boardTiles/PuddleTile';
import { _BoardTile } from './boardTiles/_BoardTile';
import C from './C'
import BoardDisplay from './displays/BoardDisplay';
import BoardLayer from './BoardLayer';
import G from './G';

export default class Board {
    tileLayer: BoardLayer<_BoardTile> = new BoardLayer<_BoardTile>();
    actorLayer: BoardLayer<Actor> = new BoardLayer<Actor>();

    constructor() {
        this.generate();
    }

    draw(gameDisplay: BoardDisplay) {
        G.BoardDisplay.update(this);
    }


    generate() {
        let map = new Map.Rogue(C.ARENA_WIDTH, C.ARENA_HEIGHT, { cellHeight: RNG.getUniform() * 2 + 1, cellWidth: RNG.getUniform() * 2 + 1 });

        let userCallback = (x: number, y: number, value: number) => {
            let pos = Board.convert2Dto1D(x, y);

            let newTile: _BoardTile;
            if (value == 0)
                if (RNG.getUniform() * 10 < 1)
                    newTile = new PuddleTile();
                else
                    newTile = new FloorTile()
            else
                newTile = new WallTile();

            this.tileLayer.set(pos, newTile);
        }
        map.create(userCallback);
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

    static isEdge(x: number, y: number) {
        return x == 0 || x == C.ARENA_WIDTH - 1 || y == 0 || y == C.ARENA_HEIGHT - 1;
    }
}