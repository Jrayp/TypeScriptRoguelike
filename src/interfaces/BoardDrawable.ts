import BoardDisplay from "../displays/BoardDisplay";

export default interface BoardDrawable {

    glyph: string;
    fgColor: string | null;
    bgColor: string | null;

    getCoords(): [number, number, string] | undefined;

    draw(boardDisplay: BoardDisplay): void;

}