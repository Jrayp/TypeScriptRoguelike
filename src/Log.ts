import { assert } from "console";
import { write } from "fs";
import { Color } from "rot-js";
import C from "./C";
import LogDisplay from "./displays/LogDisplay";
import G from "./G";


export default class Log {
    private logList: string[] = [];
    private repeatList: number[] = [];

    constructor() {
        // Hack to prevent 'undefined' showing up in the log display at start of game
        for (let i = 0; i < C.LOG_DISPLAY_HEIGHT; i++) {
            this.logList.push("");
            this.repeatList.push(0);
        }
    }

    write(text: string) {
        assert(text.length > 0);
        const logList = this.logList;
        const repeatList = this.repeatList;
        if (text === logList[logList.length - 1]) {
            repeatList[repeatList.length - 1]++;
        } else {
            logList.push(text);
            repeatList.push(1);
        }

        G.LogDisplay.update(logList, repeatList);
    }

}

