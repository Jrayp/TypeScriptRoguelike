import { Color } from "rot-js/lib/color";
import G from "./../G";
import Drawable from "./../interfaces/Drawable";
import Positional from "./../interfaces/Positional";
import Coords from "./../util/Coords";

export default abstract class _Action implements Drawable, Positional {
    abstract _glyph: string;
    abstract _fgColor: Color | null;
    abstract _bgColor: Color | null;

    get glyph(): any {
        return this._glyph;
    }
    get fgColor(): any {
        return this._fgColor;
    }
    get bgColor(): any {
        return this._bgColor;
    }

    get coords(): Coords {
        return G.board.actions.getCoordsViaElement(this)!;
    }

    doStep() {

    }

}