import Coords from "./../util/Coords";
import BoardDisplay from "../displays/BoardDisplay";

export default interface BoardDrawable {

    // TODO: Consider using the tuple for colors
    glyph: string;
    fgColor: string | null;
    bgColor: string | null;

    getCoords(): Coords | undefined;

    draw(boardDisplay: BoardDisplay): void;

}