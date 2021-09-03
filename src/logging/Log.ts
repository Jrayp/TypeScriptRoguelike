import C from "../C";
import G from "../G";
import { assertTrue } from "../util/Assertions";


export default class Log {
    private _logList: string[] = []; // TODO: Handle deletions after some max length
    private _repeatList: number[] = [];

    constructor() {
        // Hack to prevent 'undefined' showing up in the log display at start of game
        for (let i = 0; i < C.LOG_DISPLAY_HEIGHT; i++) {
            this._logList.push("");
            this._repeatList.push(0);
        }
    }

    write(text: string) {
        assertTrue(text.length > 0);
        const logList = this._logList;
        const repeatList = this._repeatList;
        if (text === logList[logList.length - 1]) {
            repeatList[repeatList.length - 1]++;
        } else {
            logList.push(text);
            repeatList.push(1);
        }

        G.logDisplay.update(logList, repeatList);
    }

}

