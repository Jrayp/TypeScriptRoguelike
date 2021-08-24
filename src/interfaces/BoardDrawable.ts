import Coords from "./../util/Coords";
import BoardDisplay from "../displays/BoardDisplay";
import { Color } from "rot-js/lib/color";

export default interface BoardDrawable {

    glyph: string;
    fgColor: Color | null;
    bgColor: Color | null;

    getCoords(): Coords | undefined;

    draw(boardDisplay: BoardDisplay): void;

}