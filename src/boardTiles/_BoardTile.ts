import { Color } from 'rot-js/lib/color';
import _Actor from './../actors/_Actor';
import IPositional from '../interfaces/IPositional';
import INamed from '../interfaces/INamed';
import BoardDisplay from '../displays/BoardDisplay';
import G from '../G';
import IDrawable from '../interfaces/IDrawable';
import Point from '../util/Point';

// Maybe concept of limbo by reversing coorinate signs??
export abstract class _BoardTile implements INamed, IDrawable, IPositional {
    abstract name: string;

    abstract _glyph: string;
    abstract _fgColor: Color | null;
    abstract _bgColor: Color | null;

    get glyph(): string {
        return this._glyph;
    }
    get fgColor(): Color | null {
        return this._fgColor;
    }
    get bgColor(): Color | null {
        return this._bgColor;
    }

    abstract passable: boolean; // Should probably be handled via function
    abstract transparent: boolean;  // Consider making this applicable to actors 
    //as well (or anything really... really need to use ECS)


    abstract topPassable: boolean;
    abstract bottomPassable: boolean;
    abstract destroyable: boolean;

    multiplyBelow : boolean = true;

    constructor() {
    }

    get position(): Point {
        return G.board.tiles.getPointViaElement(this)!;
    }

    getDrawData(boardDisplay: BoardDisplay): void {
        let Point = this.position;
        // boardDisplay.draw(point.x, point.y, this.glyph, this.fgColor, this.bgColor);
    }

    onEnter(actor: _Actor): string | undefined {
        return undefined;
    }

    get occupant() {
        const point = this.position;
        return G.board.actors.hasPoint(point) ? G.board.actors.getElementViaPoint(point) : undefined;
    }

    get opposite(): _BoardTile {
        let p = this.position.oppositePoint();
        return G.board.tiles.getElementViaPoint(p);
    }

    get upMovementValid() {
        return this.topPassable && this.opposite.bottomPassable;
    }

    get downMovementValid() {
        return this.bottomPassable && this.opposite.topPassable;
    }


    onRemove() {

    }
}