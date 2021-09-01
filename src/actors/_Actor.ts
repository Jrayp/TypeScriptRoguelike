import { Color } from 'rot-js/lib/color';
import BoardDisplay from './../displays/BoardDisplay';
import IDrawable from '../interfaces/IDrawable';
import INamed from '../interfaces/INamed';
import IPositional from '../interfaces/IPositional';
import G from '../G';
import Coords from './../util/Coords';
import IDestroyable from 'src/interfaces/IDestroyable';
import { EventEmitter } from 'stream';

export default abstract class _Actor implements INamed, IDrawable, IPositional {

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
        return G.board.actors.getCoordsViaElement(this);
    }

    getDrawData(boardDisplay: BoardDisplay): void {
        let coords = this.coords;
        // boardDisplay.draw(coords.x, coords.y, this.glyph, this.fgColor, null);
    }

    kill() {

    }

    act() {

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