import { Map, RNG } from 'rot-js';
import { ArenaTile } from './ArenaTile';
import * as C from './C'
import GameDisplay from './GameDisplay';
import ActorLayer from './layers/ActorLayer';
import TileLayer from './layers/TileLayer';

export default class ArenaMap {
    tileLayer: TileLayer = new TileLayer();
    actorLayer: ActorLayer = new ActorLayer();

    constructor() {
        this.generate();
    }

    draw(gameDisplay: GameDisplay) {
        for (let kvp of this.tileLayer.iterator()) {
            let tile = kvp[0];
            let pos = kvp[1];
            let coord = ArenaMap.convert1Dto2D(pos);
            if (this.actorLayer.hasPosition(pos)) {
                let actor = this.actorLayer.getElementViaPosition(pos);
                gameDisplay.draw(coord[0], coord[1], actor!.glyph, actor!.fg, null);
            } else {
                gameDisplay.draw(coord[0], coord[1], tile.glyph, tile.fgColor, tile.bgColor);
            }
        }
    }


    generate() {
        let map = new Map.Rogue(C.ARENA_WIDTH, C.ARENA_HEIGHT, { cellHeight: RNG.getUniform() * 2 + 1, cellWidth: RNG.getUniform() * 2 + 1 });

        let userCallback = (x: number, y: number, value: number) => {
            let pos = ArenaMap.convert2Dto1D(x, y);
            let newTile = value == 1 ? ArenaTile.newWall() : ArenaTile.newFloor();
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