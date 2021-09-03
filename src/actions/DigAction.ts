import { _BoardTile } from "./../boardTiles/_BoardTile";
import _Actor from "./../actors/_Actor";
import _Action from "./_Action";
import _DiggableTile from "./../boardTiles/_DiggableTile";
import { ActionState } from "./../Enums";

export default class DigAction extends _Action {

    private _tile: _DiggableTile;

    constructor(tile: _DiggableTile) {
        super();
        this._tile = tile;
        return this;
    }

    perform(){
        this._tile.dig();
        return ActionState.SUCCESSFUL;
    }
}