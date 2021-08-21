import { Display } from 'rot-js'
import * as C from '../C'


export default class BoardDisplay extends Display {
    private static _singleton: BoardDisplay;

    get instance() {
        return BoardDisplay._singleton;
    }

    constructor() {
        super(C.GAME_DISPLAY_OPTIONS);
        BoardDisplay._singleton = this;
    }

}

