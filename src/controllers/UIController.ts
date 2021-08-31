import { Color } from "rot-js/lib/color";
import Drawable from "./../interfaces/Drawable";
import UniqueCoordsMap from "./../util/UniqueCoordsMap";


class Icon implements Drawable {
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

}

export default class UIController extends UniqueCoordsMap<Icon> {

    static readonly TARGET_ICON = new Icon();

}