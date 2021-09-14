import { aStar } from 'ngraph.path';
import { Color } from 'rot-js/lib/color';
import G from '../G';
import IDrawable from '../interfaces/IDrawable';
import INamed from '../interfaces/INamed';
import IPositional from '../interfaces/IPositional';
import Cell from '../util/Cell';
import { _BoardTile } from './../boardTiles/_BoardTile';
import { Layer, PathDir } from './../Enums';

export default abstract class _Actor implements INamed, IDrawable, IPositional {

    abstract get name(): string;

    abstract _glyph: string;
    abstract _fgColor: Color | null;
    abstract _bgColor: Color | null;

    // TODO: This will probably be handled on per actor basis
    aStar = aStar(G.board.graph.graph, {
        distance(fromNode, toNode, link) {
            let fromTile = G.board.tiles.getElementViaCell(fromNode.data);
            let toTile = G.board.tiles.getElementViaCell(toNode.data);

            let toTileCost: number;

            if (toTile.name == "Wall")
                return Number.POSITIVE_INFINITY;
            else if (toTile.name == "Cavern Grass") {
                toTileCost = 5;
            }
            else if (toTile.layer == Layer.BELOW)
                toTileCost = 3;
            else
                toTileCost = 1;

            switch (link.data) {
                case PathDir.DIAGONAL:
                    return toTileCost * 1.5;
                case PathDir.VERTICAL:
                    if (fromTile.oppositeMovementValidFromHere())
                        return toTileCost * 5;
                    else
                        return Number.POSITIVE_INFINITY;
                case PathDir.STRAIGHT:
                    return toTileCost;
            }
        },
    });

    get glyph(): any {
        return this._glyph;
    }
    get fgColor(): any {
        return this._fgColor;
    }
    get bgColor(): any {
        return this._bgColor;
    }

    get position(): Cell | undefined {
        return G.board.actors.getCellViaElement(this);
    }

    get tile(): _BoardTile | undefined {
        if (this.position)
            return G.board.tiles.getElementViaCell(this.position);
        else return undefined;
    }



    kill() {

    }

    act() {

    }
}