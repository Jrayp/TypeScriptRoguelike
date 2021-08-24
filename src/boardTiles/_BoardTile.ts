import { Color } from 'rot-js/lib/color';
import _Actor from './../actors/_Actor';
import Positional from './../interfaces/Positional';
import Named from './../interfaces/named';
import BoardDisplay from '../displays/BoardDisplay';
import G from '../G';
import Drawable from '../interfaces/Drawable';
import Coords from './../util/Coords';

export abstract class _BoardTile implements Named, Drawable, Positional {
    abstract glyph: string;
    abstract fgColor: Color | null;
    abstract bgColor: Color | null;

    abstract name: string;

    abstract passable: boolean; // Should probably be handled via function
    abstract transparent: boolean;  // Consider making this applicable to actors 
    //as well (or anything really... really need to use ECS)

    constructor() {
    }

    getCoords(): Coords {
        return G.board.tileLayer.getCoordsViaElement(this) || undefined;
    }

    draw(boardDisplay: BoardDisplay): void {
        let coords = this.getCoords();
        // boardDisplay.draw(coords.x, coords.y, this.glyph, this.fgColor, this.bgColor);
    }

    onEnter(actor: _Actor) {
        return true;
    }
}