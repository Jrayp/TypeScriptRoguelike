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

        for (let tileAndCoords of tileLayer.iterator()) {
            let coords = tileAndCoords[1];
            if (actorLayer.hasPosition(coords)) {
                let actor = actorLayer.getElementViaCoord(coords);
                actor.draw(this);
            } else {
                let tile = tileAndCoords[0];
                tile.draw(this);
            }
        }
    }

}

