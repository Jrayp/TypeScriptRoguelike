import { Color } from "rot-js/lib/color";
import IDrawable from "../interfaces/IDrawable";
import Point from "../util/Point";


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

    private _pointToIconMap = new Map<Point, Icon>();

    addIcon(point: Point, icon: Icon) {
        this._pointToIconMap.set(point, icon);
    }

    hasIconAt(point:Point) {
        return this._pointToIconMap.has(point);
    }

    clear() {
        this._pointToIconMap.clear();
    }

    *iterate() {
        for (let i of this._pointToIconMap)
            yield i;
    }

}