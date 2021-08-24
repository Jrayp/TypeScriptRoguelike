import { Color } from "rot-js/lib/color";
import BoardDisplay from "../displays/BoardDisplay";

export default interface Drawable {

    glyph: string;
    fgColor: Color | null;
    bgColor: Color | null;

    draw(boardDisplay: BoardDisplay): void;
}