import { _BoardTile } from "./../boardTiles/_BoardTile";
import Cell from "../util/Cell";
import CellElementBiMap from "../util/CellElementBiMap";

export default class TileController extends CellElementBiMap<_BoardTile> {

    removeViaElement(element: _BoardTile) {
        this._remove(element);
        super.removeViaElement(element);
    }

    removeViaCell(cell: Cell) {
        this._remove(this.getElementViaCell(cell));
        super.removeViaCell(cell);
    }

    private _remove(tile: _BoardTile) {
        tile.onRemove();
    }

}