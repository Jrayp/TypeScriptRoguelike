import { ActionState, SwitchSetting } from "./../Enums";
import IActivatable from "../interfaces/IActivatable";
import _Action from "./_Action";
import G from "./../G";

export default class SwitchAction extends _Action {

    _activatable: IActivatable
    _setting: SwitchSetting;

    constructor(activatable: IActivatable, setting: SwitchSetting) {
        super();
        this._activatable = activatable;
        this._setting = setting;
        return this;
    }

    perform() {

        switch (this._setting) {
            case SwitchSetting.ACTIVATE:
                this._activatable.active = true;
                break;

            case SwitchSetting.DEACTIVATE:
                this._activatable.active = false;
                break;

            case SwitchSetting.TOGGLE:
                this._activatable.active = !this._activatable.active;
                break;
        }

        return ActionState.SUCCESSFUL;
    }


}