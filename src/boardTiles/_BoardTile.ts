import { Color } from 'rot-js/lib/color';
import _Actor from './../actors/_Actor';
import IPositional from '../interfaces/IPositional';
import INamed from '../interfaces/INamed';
import BoardDisplay from '../displays/BoardDisplay';
import G from '../G';
import IDrawable from '../interfaces/IDrawable';
import Cell from '../util/Cell';
import { Layer } from './../Enums';

// Maybe concept of limbo by reversing coorinate signs??
export abstract class _BoardTile implements INamed, IDrawable, IPositional {
    abstract get name(): string;

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

    getTraverseCost(actor: _Actor) : number {
        return 0;
    }

    multiplyBelow: boolean = true;

    constructor() {
    }

    get position(): Cell {
        return G.board.tiles.getCellViaElement(this)!;
    }

    get layer() {
        return this.position?.layer;
    }

    onEnter(actor: _Actor): string | undefined {
        return undefined;
    }

    occupant() {
        const cell = this.position;
        return G.board.actors.hasCell(cell) ? G.board.actors.getElementViaCell(cell) : undefined;
    }

    opposite(): _BoardTile {
        let p = this.position.oppositeCell();
        return G.board.tiles.getElementViaCell(p);
    }

    oppositeMovementValidFromHere() {
        switch (this.layer) {
            case Layer.ABOVE:
                return this.downMovementValidFromHere();
            case Layer.BELOW:
                return this.upMovementValidFromHere();
        }
    }

    upMovementValidFromHere() {
        return this.topPassable && this.opposite().bottomPassable;
    }

    downMovementValidFromHere() {
        return this.bottomPassable && this.opposite().topPassable;
    }


    upMovementValidToHere() {
        return this.bottomPassable && this.opposite().topPassable;
    }

    downMovementValidToHere() {
        return this.topPassable && this.opposite().bottomPassable;
    }


    onRemove() {

    }
}