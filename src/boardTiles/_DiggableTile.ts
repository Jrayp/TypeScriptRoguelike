import G from "./../G";
import Diggable from "./../interfaces/Diggable";
import { FloorTile } from "./FloorTile";
import { _BoardTile } from "./_BoardTile";

export default abstract class _DiggableTile extends _BoardTile implements Diggable {
    abstract digStrength: number;

    dig() {
        this.digStrength--;

        switch (this.digStrength) {
            case 2:
                this.glyph = ';';
                break;
            case 1:
                this.glyph = '%';
                break;
            case 0:
                G.board.tileLayer.replace(this.getCoords(), new FloorTile());
                G.board.lightManager.updateFov();
        }
    }


}