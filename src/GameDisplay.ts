import { Display } from 'rot-js'
import * as C from './C'


export default class GameDisplay extends Display {
    constructor() {
        super(C.GAME_DISPLAY_OPTIONS);
    }
}

