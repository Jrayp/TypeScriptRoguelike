import { ActionState } from "./../Enums";
import _Actor from "./../actors/_Actor";
import G from "./../G";
import Point from "../util/Point";
import _Action from "./_Action";

export default class MoveAction extends _Action {

    private _actor: _Actor;
    private _dest: Point;

    constructor(actor: _Actor, dest: Point) {
        super();
        this._actor = actor;
        this._dest = dest;
        return this;
    }

    perform() {
        G.board.actors.moveElementToPoint(this._actor, this._dest);
        let tile = this._actor.tile!;
        let log = tile.onEnter(this._actor);
        if (log)
            this.logAfter(log);
        return ActionState.SUCCESSFUL;
    }

}