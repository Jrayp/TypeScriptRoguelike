import { Color } from "rot-js/lib/color";
import IDrawable from "../interfaces/IDrawable";
import Coords from "../util/Coords";


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

    private _coordsToIconMap = new Map<Coords, Icon>();
    private _keys = new Set<number>();

    addIcon(coords: Coords, icon: Icon) {
        this._coordsToIconMap.set(coords, icon);
        this._keys.add(coords.key);
    }

    hasKey(key: number) {
        return this._keys.has(key);
    }

    clear() {
        this._coordsToIconMap.clear();
        this._keys.clear();
    }

    *iterate() {
        for (let i of this._coordsToIconMap)
            yield i;
    }

}