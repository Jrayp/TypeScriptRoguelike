import { Color } from "rot-js/lib/color";

export default interface IDrawable {
    get glyph() : string;
    get fgColor() : Color | null;
    get bgColor() : Color | null;
}