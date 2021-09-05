import { Color as ColorHelper, Display } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import { _BoardTile } from 'src/boardTiles/_BoardTile';
import C from '../C';
import Board from './../Board';
import G from './../G';


export default class BoardDisplay extends Display {

    width: number;
    height: number;

    tileWidth: number;
    tileHeight: number;

    rect: DOMRect;

    constructor() {
        super(C.BOARD_DISPLAY_OPTIONS);
    }

    update(board: Board, seenTileKeys: Set<number>, percievedOpaqueColors: Map<number, Color>) {
        const tileLayer = board.tiles;
        const actorLayer = board.actors;
        const lightManager = G.board.lights;
        const actionLayer = G.board.effects;
        const icons = G.board.icons;

        this.clear();

        let tile: _BoardTile;
        let fgDrawColor: string | null;
        let bgDrawColor: string | null;

        for (let seenKey of seenTileKeys) {
            if (icons.hasKey(seenKey))
                continue;

            tile = tileLayer.getElementViaKey(seenKey);
            const point = tile.position;

            if (actionLayer.hasPoint(point)) {
                let action = actionLayer.getElementViaPoint(point);
                fgDrawColor = this.convertColor(action.fgColor);
                bgDrawColor = this.convertColor(action.bgColor);
                this.draw(point.x, point.y, action.glyph, fgDrawColor, bgDrawColor);
            }
            else if (actorLayer.hasPoint(point)) {
                let actor = actorLayer.getElementViaPoint(point);
                fgDrawColor = this.convertColor(actor.fgColor);
                bgDrawColor = this.convertColor(actor.bgColor);
                this.draw(point.x, point.y, actor.glyph, fgDrawColor, bgDrawColor);
            }
            else if (!tile.transparent) { // Walls etc 
                let percievedLightColor = percievedOpaqueColors.get(seenKey)!;
                fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, percievedLightColor);
                bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, percievedLightColor);
                this.draw(point.x, point.y, tile.glyph, fgDrawColor, bgDrawColor);
            }
            else { // Transparent Tiles 
                let lightColor: Color = lightManager.getColor(point.key)!;
                fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, lightColor);
                bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, lightColor);
                this.draw(point.x, point.y, tile._glyph, fgDrawColor, bgDrawColor);
            }
        }

        for (let iconAndPoint of icons.iterate()) {
            let icon = iconAndPoint[1];
            let point = iconAndPoint[0];
            let fgDrawColor = this.convertColor(icon.fgColor);
            let bgDrawColor = this.convertColor(icon.bgColor);
            this.draw(point.x, point.y, icon.glyph, fgDrawColor, bgDrawColor);
        }
    }

    private convertColor(color: Color | null) {
        return !color ? null : ColorHelper.toRGB(color);
    }

    private multiplyAndConvertColor(color: Color | null, multipler: Color) {
        return !color ? null : ColorHelper.toRGB(ColorHelper.multiply(color, multipler));
    }
}
