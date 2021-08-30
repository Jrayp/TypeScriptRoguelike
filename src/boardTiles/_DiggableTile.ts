import G from "./../G";
import Diggable from "./../interfaces/Diggable";
import { FloorTile } from "./FloorTile";
import { RubbleTile } from "./RubbleTile";
import { _BoardTile } from "./_BoardTile";

export default abstract class _DiggableTile extends _BoardTile implements Diggable {
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
                G.board.lightManager.updateFov();
        }
    }


}