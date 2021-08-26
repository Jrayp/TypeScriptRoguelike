import _Actor from "src/actors/_Actor";

export default abstract class _Action {


    protected _actor: _Actor;


    constructor(actor: _Actor) {
        this._actor = actor;
    }


    abstract perform() : void;

}