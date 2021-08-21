import { ArenaTile } from './ArenaTile';
import * as C from './C'

export default class ArenaMap {
    map: ArenaTile[][];

    constructor() {
        this.map = [];

        for (let x: number = 0; x < C.ARENA_WIDTH; x++) {
            this.map[x] = [];
            for (let y: number = 0; y < C.ARENA_HEIGHT; y++) {
                if (this.isEdge(x, y))
                    this.map[x][y] = ArenaTile.newWall();
                else
                    this.map[x][y] = ArenaTile.newFloor();
            }
        }
    }

    isEdge(x: Number, y: number) {
        return x == 0 || x == C.ARENA_WIDTH - 1 || y == 0 || y == C.ARENA_HEIGHT - 1;
    }

    generate() {

    }
}