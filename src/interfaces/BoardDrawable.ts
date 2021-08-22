import BoardDisplay from "../displays/BoardDisplay";

export default interface BoardDrawable {

    glyph: string;
    fgColor: string | null;
    bgColor: string | null;

    getPosition(): number | undefined;
    getCoords(): [number, number] | undefined;

    draw(boardDisplay: BoardDisplay): void;

}