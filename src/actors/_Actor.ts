import BoardDrawable from 'src/interfaces/BoardDrawable';
import BoardDisplay from 'src/displays/BoardDisplay';
import Board from '../Board';
import G from '../G'


export default abstract class Actor implements BoardDrawable {

    glyph: string;
    fgColor: string | null;
    bgColor: string | null;

    getPosition() {
        return G.Board.actorLayer.getPositionViaElement(this);
    }

    getCoords(): [number, number] {
        let pos = this.getPosition();
        return Board.convert1Dto2D(pos!);
    }

    draw(gameDisplay: BoardDisplay): void {
        let coords = this.getCoords();
        gameDisplay.draw(coords[0], coords[1], this.glyph, this.fgColor, null);
    }

    move(newPos: number) {
        let destinationTile = G.Board.tileLayer.getElementViaPosition(newPos);

        if (G.Board.tileLayer.getElementViaPosition(newPos)?.passable) {
            G.Board.actorLayer.moveViaElement(this, newPos);
            destinationTile.onEnter(this)
            return true;
        }
        else {
            return false;
        }
    }



}