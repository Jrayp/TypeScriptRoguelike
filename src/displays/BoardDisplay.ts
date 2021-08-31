import { Color as ColorHelper, Display } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import _Actor from 'src/actors/_Actor';
import { _BoardTile } from 'src/boardTiles/_BoardTile';
import C from '../C';
import Board from './../Board';
import G from './../G';


export default class BoardDisplay extends Display {
    constructor() {
        super(C.BOARD_DISPLAY_OPTIONS);
    }

    update(board: Board, seenTileKeys: Set<string>, percievedOpaqueColors: Map<string, Color>) {
        const tileLayer = board.tiles;
        const actorLayer = board.actors;
        const lightManager = G.board.lights;
        const actionLayer = G.board.effects;

        this.clear();

        let tile: _BoardTile;
        let fgDrawColor: string | null;
        let bgDrawColor: string | null;

        for (let seenKey of seenTileKeys) {
            tile = tileLayer.getElementViaKey(seenKey);
            const coords = tile.coords;


            if (actionLayer.hasCoords(coords)) {
                let action = actionLayer.getElementViaCoords(coords);
                fgDrawColor = this.convertColor(action.fgColor);
                bgDrawColor = this.convertColor(action.bgColor);
                this.draw(coords.x, coords.y, action.glyph, fgDrawColor, bgDrawColor);
            }
            else if (actorLayer.hasCoords(coords)) {
                let actor = actorLayer.getElementViaCoords(coords);
                fgDrawColor = this.convertColor(actor.fgColor);
                bgDrawColor = this.convertColor(actor.bgColor);
                this.draw(coords.x, coords.y, actor.glyph, fgDrawColor, bgDrawColor);
            }
            else if (!tile.transparent) { // Walls etc 
                let percievedLightColor = percievedOpaqueColors.get(seenKey)!;
                fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, percievedLightColor);
                bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, percievedLightColor);
                this.draw(coords.x, coords.y, tile.glyph, fgDrawColor, bgDrawColor);
            }
            else { // Transparent Tiles 
                let lightColor: Color = lightManager.getColor(coords.key)!;
                fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, lightColor);
                bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, lightColor);
                this.draw(coords.x, coords.y, tile._glyph, fgDrawColor, bgDrawColor);
            }
        }


    }


    drawUI() {
        const icons = G.board.icons;
        const tileLayer = G.board.tiles;

        for (let t of tileLayer.iterateElements()) {
            let coords = t[1];
            if (icons.has(coords)) {
                let icon = icons.get(coords)!;
                let fgDrawColor = this.convertColor(icon.fgColor);
                let bgDrawColor = this.convertColor(icon.bgColor);
                this.draw(coords.x, coords.y, icon.glyph, fgDrawColor, bgDrawColor);
            }
        }
    }

    private convertColor(color: Color | null) {
        return !color ? null : ColorHelper.toRGB(color);
    }

    private multiplyAndConvertColor(color: Color | null, multipler: Color) {
        return !color ? null : ColorHelper.toRGB(ColorHelper.multiply(color, multipler));
    }
}
