import BoardDrawable from 'src/interfaces/BoardDrawable';
import BoardDisplay from 'src/displays/BoardDisplay';
import Board from '../Board';
import G from '../G'
import Coords from './../util/Coords';


export default abstract class _Actor implements BoardDrawable {

    glyph: string;
    fgColor: string | null;
    bgColor: string | null;

    getCoords(): Coords {
        return G.Board.actorLayer.getCoordsViaElement(this);
    }

    draw(boardDisplay: BoardDisplay): void {
        let coords = this.getCoords();
        boardDisplay.draw(coords.x, coords.y, this.glyph, this.fgColor, null);
    }

    move(newCoords: Coords) {
        let destinationTile = G.Board.tileLayer.getElementViaCoords(newCoords);

        if (G.Board.tileLayer.getElementViaCoords(newCoords)?.passable) {
            G.Board.actorLayer.moveViaElement(this, newCoords);
            destinationTile.onEnter(this)
            return true;
        }
        else {
            return false;
        }
    }



}