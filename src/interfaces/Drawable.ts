import { Color } from "rot-js/lib/color";
import { DrawData } from "./../types/DrawData";

export default interface Drawable {

    _glyph: string;
    _fgColor: Color | null;
    _bgColor: Color | null;

    get glyph() : string;
    get fgColor() : Color | null;
    get bgColor() : Color | null;
}