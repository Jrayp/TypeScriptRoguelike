import { Display } from 'rot-js';
import C from '../C';
import Board from './../Board';


export default class BoardDisplay extends Display {

    constructor() {
        super(C.BOARD_DISPLAY_OPTIONS);
    }

    update(board: Board) {
        const tileLayer = board.tileLayer;
        const actorLayer = board.actorLayer;

        for (let posAndTile of tileLayer.iterator()) {
            let pos = posAndTile[0];
            if (actorLayer.hasPosition(pos)) {
                let actor = actorLayer.getElementViaPosition(pos);
                actor.draw(this);
            } else {
                let tile = posAndTile[1];
                tile.draw(this);
            }
        }
    }

}

