import { Color, Display } from 'rot-js'
import Log from './../Log';
import * as C from '../C'


export default class LogDisplay extends Display {

    private static _singleton: LogDisplay;

    static get instance() {
        return LogDisplay._singleton;
    }

    constructor() {
        super(C.LOG_DISPLAY_OPTIONS);
        LogDisplay._singleton = this;
    }

    // TODO: Clean up
    static update(logList: string[], repeatList: number[]) {
        this.instance.clear();
        let colors: string;
        let repeat: number | string;
        for (let i = 0; i <= C.LOG_DISPLAY_HEIGHT; i++) {
            let c = Color.interpolate(Color.fromString(Color.toRGB([255, 255, 255])), Color.fromString(Color.toRGB([60, 60, 60])), i / 5);
            colors = "%c{" + Color.toRGB(c) + "}";
            repeat = repeatList[repeatList.length - i];
            repeat = repeat > 0 ? ` (${repeat}x)` : "";
            this.instance.drawText(0, C.LOG_DISPLAY_HEIGHT - i, colors + logList[logList.length - i] + repeat || "");
        }
    }
}

