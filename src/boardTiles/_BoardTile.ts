import BoardDrawable from '../interfaces/BoardDrawable';
import BoardDisplay from '../displays/BoardDisplay';
import G from '../G'
import Board from '../Board';
import Named from 'src/interfaces/named';
import _Actor from 'src/actors/_Actor';

export abstract class _BoardTile implements Named, BoardDrawable {

    abstract glyph: string;
    abstract fgColor: string | null;
    abstract bgColor: string | null;

    abstract name: string;

    abstract passable: boolean;

    constructor() {
    }

    getCoords(): [number, number, string] {
        return G.Board.tileLayer.getCoordViaElement(this);
    }

    draw(boardDisplay: BoardDisplay): void {
        let coords = this.getCoords();
        boardDisplay.draw(coords[0], coords[1], this.glyph, this.fgColor, this.bgColor);
    }

    onEnter(actor: _Actor) {
        return true;
    }
}