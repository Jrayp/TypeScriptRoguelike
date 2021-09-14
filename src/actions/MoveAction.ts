import { ActionState } from "./../Enums";
import _Actor from "./../actors/_Actor";
import G from "./../G";
import Cell from "../util/Cell";
import _Action from "./_Action";

export default class MoveAction extends _Action {

    private _actor: _Actor;
    private _dest: Cell;

    constructor(actor: _Actor, dest: Cell) {
        super();
        this._actor = actor;
        this._dest = dest;
        return this;
    }

    perform() {
        G.board.actors.moveElementToCell(this._actor, this._dest);
        let tile = this._actor.tile!;
        let log = tile.onEnter(this._actor);
        if (log)
            this.logAfter(log);
        return ActionState.SUCCESSFUL;
    }

}