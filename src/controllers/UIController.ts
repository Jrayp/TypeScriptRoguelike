import { Color } from "rot-js/lib/color";
import Coords from "./../util/Coords";
import IDrawable from "../interfaces/IDrawable";
import UniqueCoordsMap from "./../util/UniqueCoordsMap";


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

    static readonly TARGET_ICON = new Icon('X', [255, 255, 255], null);

    constructor(glyph: string, fgColor: Color | null, bgColor: Color | null) {
        this._glyph = glyph;
        this._fgColor = fgColor;
        this._bgColor = bgColor;
    }

}

export default class UIController {

    _keyToIconMap = new Map<string, Icon>();


    addIcon(coords: Coords, icon: Icon) {
        this._keyToIconMap.set(coords.key, icon);
    }

    has(coords: Coords) {
        return this._keyToIconMap.has(coords.key);
    }

    get(coords: Coords) {
        return this._keyToIconMap.get(coords.key);
    }

    clear() {
        this._keyToIconMap.clear();
    }


}