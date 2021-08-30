import { Color } from 'rot-js/lib/color';
import BoardDisplay from './../displays/BoardDisplay';
import Drawable from './../interfaces/Drawable';
import Named from './../interfaces/named';
import Positional from './../interfaces/Positional';
import G from '../G';
import Coords from './../util/Coords';
import Destroyable from 'src/interfaces/Destroyable';
import { EventEmitter } from 'stream';

export default abstract class _Actor implements Named, Drawable, Positional {

    abstract name: string;

    abstract _glyph: string;
    abstract _fgColor: Color | null;
    abstract _bgColor: Color | null;

    get glyph(): any {
        return this._glyph;
    }
    get fgColor(): any {
        return this._fgColor;
    }
    get bgColor(): any {
        return this._bgColor;
    }

    get coords(): Coords | undefined {
        return G.board.actorLayer.getCoordsViaElement(this);
    }

    getDrawData(boardDisplay: BoardDisplay): void {
        let coords = this.coords;
        // boardDisplay.draw(coords.x, coords.y, this.glyph, this.fgColor, null);
    }

    kill() {

    }

    // move(newCoords: Coords) {
    //     let destinationTile = G.board.tileLayer.getElementViaCoords(newCoords);

    //     if (G.board.tileLayer.getElementViaCoords(newCoords).passable) {
    //         G.board.actorLayer.moveViaElement(this, newCoords);
    //         destinationTile.onEnter(this)
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

}