import BoardDrawable from 'src/interfaces/BoardDrawable';
import BoardDisplay from 'src/displays/BoardDisplay';
import Board from '../Board';
import G from '../G'


export default abstract class _Actor implements BoardDrawable {

    glyph: string;
    fgColor: string | null;
    bgColor: string | null;

    getCoords(): [number, number, string] {
        return G.Board.actorLayer.getCoordViaElement(this);
    }

    draw(boardDisplay: BoardDisplay): void {
        let coords = this.getCoords();
        boardDisplay.draw(coords[0], coords[1], this.glyph, this.fgColor, null);
    }

    move(newCoords: [number, number, string]) {
        let destinationTile = G.Board.tileLayer.getElementViaCoord(newCoords);

        if (G.Board.tileLayer.getElementViaCoord(newCoords)?.passable) {
            G.Board.actorLayer.moveViaElement(this, newCoords);
            destinationTile.onEnter(this)
            return true;
        }
        else {
            return false;
        }
    }



}