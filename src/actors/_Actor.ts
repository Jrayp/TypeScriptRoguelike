import { Color } from 'rot-js/lib/color';
import BoardDisplay from 'src/displays/BoardDisplay';
import BoardDrawable from 'src/interfaces/BoardDrawable';
import G from '../G';
import Coords from './../util/Coords';

export default abstract class _Actor implements BoardDrawable {

    glyph: string;
    fgColor: Color | null;
    bgColor: Color | null;

    getCoords(): Coords {
        return G.board.actorLayer.getCoordsViaElement(this);
    }

    draw(boardDisplay: BoardDisplay): void {
        let coords = this.getCoords();
        // boardDisplay.draw(coords.x, coords.y, this.glyph, this.fgColor, null);
    }

    move(newCoords: Coords) {
        let destinationTile = G.board.tileLayer.getElementViaCoords(newCoords);

        if (G.board.tileLayer.getElementViaCoords(newCoords)?.passable) {
            G.board.actorLayer.moveViaElement(this, newCoords);
            destinationTile.onEnter(this)
            return true;
        }
        else {
            return false;
        }
    }




}