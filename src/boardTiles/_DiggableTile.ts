import G from "./../G";
import IDiggable from "../interfaces/IDiggable";
import { FloorTile } from "./FloorTile";
import { RubbleTile } from "./RubbleTile";
import { _BoardTile } from "./_BoardTile";

export default abstract class _DiggableTile extends _BoardTile implements IDiggable {
    abstract digStrength: number;

    dig() {
        this.digStrength--;

        switch (this.digStrength) {
            case 2:
                this._glyph = ':';
                break;
            case 1:
                this._glyph = ';';
                break;
            case 0:
                G.board.tiles.replace(this.coords, new RubbleTile(this._bgColor!));
                G.board.lights.updateFov();
        }
    }


}