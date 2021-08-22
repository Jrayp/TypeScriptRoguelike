import { Color, Display } from 'rot-js'
import Log from './../Log';
import C from '../C'


export default class LogDisplay extends Display {

    private readonly _startColor: [number, number, number] = [255, 255, 255];
    private readonly _endColor: [number, number, number] = [60, 60, 60];

    private readonly _colorCache: string[] = [];

    constructor() {
        super(C.LOG_DISPLAY_OPTIONS);
        this.initColorCache();
    }

    initColorCache() {
        let interpolatedColor: [number, number, number];
        let colorString: string;
        for (let i = 0; i <= C.LOG_DISPLAY_HEIGHT; i++) {
            interpolatedColor = Color.interpolate(this._startColor, this._endColor, i / C.LOG_DISPLAY_HEIGHT);
            colorString = "%c{" + Color.toRGB(interpolatedColor) + "}";
            this._colorCache.push(colorString);
        }
    }

    update(logList: string[], repeatList: number[]) {
        this.clear();
        let repeat: number | string;
        let rowText: string;
        for (let i = 0; i <= C.LOG_DISPLAY_HEIGHT; i++) {
            repeat = repeatList[repeatList.length - i];
            repeat = repeat > 1 ? ` (${repeat}x)` : "";
            rowText = this._colorCache[i] + logList[logList.length - i] + repeat;
            this.drawText(0, C.LOG_DISPLAY_HEIGHT - i, rowText);
        }
    }
}

