import { RNG } from "rot-js";
import IDiggable from "../interfaces/IDiggable";
import G from "./../G";
import { RubbleTile } from "./RubbleTile";
import { _BoardTile } from "./_BoardTile";

export default abstract class _DiggableTile extends _BoardTile implements IDiggable {
    abstract digStrength: number;

    dig() {
        this.digStrength--;

        switch (this.digStrength) {
            case 2:
                this._glyph = RNG.getItem([',', '`', '.'])!;
                break;
            case 1:
                this._glyph = RNG.getItem(['%', ';', ':'])!;
                break;
            case 0:
                G.board.tiles.replace(this.position, new RubbleTile(this._bgColor!));
        }
    }


}