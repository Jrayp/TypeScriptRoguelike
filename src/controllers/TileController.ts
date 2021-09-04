import { _BoardTile } from "./../boardTiles/_BoardTile";
import Coords from "../util/Coords";
import UniqueCoordsMap from "./../util/UniqueCoordsMap";

export default class TileController extends UniqueCoordsMap<_BoardTile> {

    removeViaKey(key: string) {
        this._remove(this.getElementViaKey(key));
        super.removeViaKey(key);
    }

    removeViaElement(element: _BoardTile) {
        this._remove(element);
        super.removeViaElement(element);
    }

    removeViaCoords(coords: Coords) {
        this._remove(this.getElementViaCoords(coords));
        super.removeViaCoords(coords);
    }

    private _remove(tile: _BoardTile) {
        tile.onRemove();
    }

}