import { Color } from "rot-js/lib/color";
import IDrawable from "../interfaces/IDrawable";
import Cell from "../util/Cell";


export class Icon implements IDrawable {
    _glyph: string;
    _fgColor: Color | null;
    _bgColor: Color | null;

    get glyph(): string {
        return this._glyph;
    }
    get fgColor(): Color | null {
        return this._fgColor;
    }
    get bgColor(): Color | null {
        return this._bgColor;
    }

    static readonly TARGET_ICON = new Icon('*', [255, 255, 0], null);

    constructor(glyph: string, fgColor: Color | null, bgColor: Color | null) {
        this._glyph = glyph;
        this._fgColor = fgColor;
        this._bgColor = bgColor;
    }

}

export default class UIController {

    private _cellToIconMap = new Map<Cell, Icon>();

    addIcon(cell: Cell, icon: Icon) {
        this._cellToIconMap.set(cell, icon);
    }

    hasIconAt(cell:Cell) {
        return this._cellToIconMap.has(cell);
    }

    clear() {
        this._cellToIconMap.clear();
    }

    *iterate() {
        for (let i of this._cellToIconMap)
            yield i;
    }

}