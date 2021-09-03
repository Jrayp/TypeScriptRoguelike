import { ActionState } from "./../Enums";

export default abstract class _Action {

    state: string = ActionState.PENDING;

    private _beforeLogCallback: () => string;
    private _afterLogCallback: () => string;

    get beforeLogCallback() {
        return this._beforeLogCallback ? this._beforeLogCallback : undefined;
    }

    get afterLogCallback() {
        return this._afterLogCallback ? this._afterLogCallback : undefined;
    }


    logBefore(text: string) {
        this._beforeLogCallback = () => { return text };
        return this;
    }

    logAfter(text: string) {
        this._afterLogCallback = () => { return text };
        return this;
    }

    logBeforeConditional(conditionalTextCallback: () => string) {
        this._beforeLogCallback = conditionalTextCallback;
        return this;
    }

    logAfterConditional(conditionalTextCallback: () => string) {
        this._afterLogCallback = conditionalTextCallback;
        return this;
    }

    perform(): string {
        return ActionState.SUCCESSFUL;
    }
}