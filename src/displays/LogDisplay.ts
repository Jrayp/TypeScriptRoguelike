import { Display } from 'rot-js'
import * as C from '../C'


export default class LogDisplay extends Display {

    private static _singleton: LogDisplay;

    get instance() {
        return LogDisplay._singleton;
    }

    constructor() {
        super(C.LOG_DISPLAY_OPTIONS);
        LogDisplay._singleton = this;
    }

    // TODO: Make log object handle this
    static log(text: string) {
        this._singleton.clear();
        this._singleton.drawText(0, 0, text);
    }
}

