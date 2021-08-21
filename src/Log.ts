import LogDisplay from "./displays/LogDisplay";


export default class Log {
    private static _singleton: Log;

    private logDisplay: LogDisplay;

    // Consider moving backwards to mimic a queue?
    private logList: string[] = [];
    private repeatList: number[] = [];

    static get instance() {
        return Log._singleton;
    }

    constructor(logDisplay: LogDisplay) {
        Log._singleton = this;
        this.logDisplay = logDisplay;
    }

    static Write(text: string) {
        let logList = Log.instance.logList;
        let repeatList = Log.instance.repeatList;
        if (text === logList[logList.length - 1]) {
            repeatList[repeatList.length - 1]++;
        } else {
            logList.push(text);
            repeatList.push(0);
        }

        LogDisplay.update(logList, repeatList);
    }

}

