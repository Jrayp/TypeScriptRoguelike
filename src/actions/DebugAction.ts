import _Action from "./_Action";
import { ActionState } from "./../Enums";

export default class DebugAction extends _Action {

    private _func: () => string;

    constructor(perform: () => string) {
        super();
        this._func = perform;
        return this;
    }

    perform() {
        return this._func();
    }

}