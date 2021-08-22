import { assert } from "console";
import C from "./C";
import G from "./G";


export default class Log {
    private _logList: string[] = [];
    private _repeatList: number[] = [];

    constructor() {
        // Hack to prevent 'undefined' showing up in the log display at start of game
        for (let i = 0; i < C.LOG_DISPLAY_HEIGHT; i++) {
            this._logList.push("");
            this._repeatList.push(0);
        }
    }

    write(text: string) {
        assert(text.length > 0);
        const logList = this._logList;
        const repeatList = this._repeatList;
        if (text === logList[logList.length - 1]) {
            repeatList[repeatList.length - 1]++;
        } else {
            logList.push(text);
            repeatList.push(1);
        }

        G.LogDisplay.update(logList, repeatList);
    }

}
