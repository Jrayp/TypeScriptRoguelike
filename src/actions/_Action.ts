import { Color } from "rot-js/lib/color";
import G from "./../G";
import Coords from "./../util/Coords";
import BoardDisplay from "./../displays/BoardDisplay";
import Drawable from "./../interfaces/Drawable";
import Positional from "./../interfaces/Positional";

export default abstract class _Action implements Drawable, Positional {

    abstract glyph: string;
    abstract fgColor: Color | null;
    abstract bgColor: Color | null;

    getCoords(): Coords {
        return G.board.actionLayer.getCoordsViaElement(this)!;
    }

    doStep() {

    }

    getDrawData(boardDisplay: BoardDisplay): void {
        throw new Error("Method not implemented.");
    }
}