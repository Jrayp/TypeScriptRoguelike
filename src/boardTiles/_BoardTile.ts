import _Actor from 'src/actors/_Actor';
import Named from 'src/interfaces/named';
import BoardDisplay from '../displays/BoardDisplay';
import G from '../G';
import BoardDrawable from '../interfaces/BoardDrawable';
import Coords from './../util/Coords';

export abstract class _BoardTile implements Named, BoardDrawable {

    abstract glyph: string;
    abstract fgColor: string | null;
    abstract bgColor: string | null;

    abstract name: string;

    abstract passable: boolean;
    abstract transparent: boolean;  // Consider making this applicable to actors 
    //as well (or anything really... really need to use ECS)

    constructor() {
    }

    getCoords(): Coords {
        return G.board.tileLayer.getCoordsViaElement(this);
    }

    draw(boardDisplay: BoardDisplay): void {
        let coords = this.getCoords();
        boardDisplay.draw(coords.x, coords.y, this.glyph, this.fgColor, this.bgColor);
    }

    onEnter(actor: _Actor) {
        return true;
    }
}