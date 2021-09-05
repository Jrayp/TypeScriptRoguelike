import { Color } from 'rot-js/lib/color';
import G from '../G';
import IDrawable from '../interfaces/IDrawable';
import INamed from '../interfaces/INamed';
import IPositional from '../interfaces/IPositional';
import { _BoardTile } from './../boardTiles/_BoardTile';
import BoardDisplay from './../displays/BoardDisplay';
import Point from '../util/Point';

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

    get position(): Point | undefined {
        return G.board.actors.getPointViaElement(this);
    }

    get tile(): _BoardTile | undefined {
        if (this.position)
            return G.board.tiles.getElementViaPoint(this.position);
        else return undefined;
    }

    getDrawData(boardDisplay: BoardDisplay): void {
        let Point = this.position;
        // boardDisplay.draw(point.x, point.y, this.glyph, this.fgColor, null);
    }

    kill() {

    }

    act() {

    }

    // move(newpoint: Point) {
    //     let destinationTile = G.board.tileLayer.getElementViaPoint(newPoint);

    //     if (G.board.tileLayer.getElementViaPoint(newPoint).passable) {
    //         G.board.actorLayer.moveViaElement(this, newPoint);
    //         destinationTile.onEnter(this)
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

}