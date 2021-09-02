import _Actor from "./../actors/_Actor";
import _Action from "./_Action";

export default class AttackAction extends _Action {

    private _actor: _Actor;

    constructor(actor: _Actor) {
        super();
        this._actor = actor;
        return this;
    }

    perform() {
        this._actor.kill();
    }

}