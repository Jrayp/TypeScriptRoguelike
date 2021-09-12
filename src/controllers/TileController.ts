import { _BoardTile } from "./../boardTiles/_BoardTile";
import Point from "../util/Point";
import UniquePointMap from "./../util/UniquePointMap";

export default class TileController extends UniquePointMap<_BoardTile> {

    removeViaElement(element: _BoardTile) {
        this._remove(element);
        super.removeViaElement(element);
    }

    removeViaPoint(point: Point) {
        this._remove(this.getElementViaPoint(point));
        super.removeViaPoint(point);
    }

    private _remove(tile: _BoardTile) {
        tile.onRemove();
    }

}