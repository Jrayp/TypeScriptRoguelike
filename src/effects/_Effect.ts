import { Color } from "rot-js/lib/color";
import G from "../G";
import IDrawable from "../interfaces/IDrawable";
import IPositional from "../interfaces/IPositional";
import Cell from "../util/Cell";

export default abstract class _Effect implements IDrawable, IPositional {
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

    get position(): Cell {
        return G.board.effects.getCellViaElement(this)!;
    }

    doStep() {

    }

}