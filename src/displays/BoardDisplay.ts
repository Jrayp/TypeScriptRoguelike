import { Color as ColorHelper, Display } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import { _BoardTile } from './../boardTiles/_BoardTile';
import { Layer } from './../Enums';
import C from '../C';
import Board from './../Board';
import G from './../G';
import Point from './../util/Point';


export default class BoardDisplay extends Display {

    widthInTiles: number;
    heightInTiles: number;

    tileWidth: number;
    tileHeight: number;

    rect: DOMRect;

    constructor() {
        super(C.BOARD_DISPLAY_OPTIONS);
    }

    init() {
        this.rect = this.getContainer()!.getBoundingClientRect();
        this.widthInTiles = C.BOARD_WIDTH;
        this.heightInTiles = C.BOARD_HEIGHT;
        this.tileWidth = this.rect.width / this.widthInTiles;
        this.tileHeight = this.rect.height / this.heightInTiles;
    }

    drawBoard(board: Board, seenTilePoints: Set<Point>, percievedOpaqueColors: Map<Point, Color>) {
        const tileLayer = board.tiles;
        const actorLayer = board.actors;
        const lightManager = G.board.lights;
        const actionLayer = G.board.effects;
        const icons = G.board.icons;

        this.clear();

        let tile: _BoardTile;
        let fgDrawColor: string | null;
        let bgDrawColor: string | null;

        for (let seenPoint of seenTilePoints) {
            if (icons.hasIconAt(seenPoint))
                continue;

            tile = tileLayer.getElementViaPoint(seenPoint);
            const position = tile.position;
            const belowLayer = position.layer == Layer.BELOW;
            const belowBlend: Color = [0, 100, 255];

            if (actionLayer.hasPoint(position)) {
                let action = actionLayer.getElementViaPoint(position);
                fgDrawColor = this.convertColor(action.fgColor);
                bgDrawColor = this.convertColor(action.bgColor);
                this.draw(position.x, position.y, action.glyph, fgDrawColor, bgDrawColor);
            }
            else if (actorLayer.hasPoint(position)) {
                let actor = actorLayer.getElementViaPoint(position);
                fgDrawColor = this.convertColor(actor.fgColor);
                bgDrawColor = this.convertColor(actor.bgColor);
                this.draw(position.x, position.y, actor.glyph, fgDrawColor, bgDrawColor);
            }
            else if (!tile.transparent) { // Walls etc 
                let percievedLightColor = percievedOpaqueColors.get(seenPoint)!;
                if (belowLayer && tile.multiplyBelow) {
                    fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, percievedLightColor, belowBlend);
                    bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, percievedLightColor, belowBlend);
                }
                else { // Currently still not perfect. probably add blue not multiply
                    fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, percievedLightColor);
                    bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, percievedLightColor);
                }
                this.draw(position.x, position.y, tile.glyph, fgDrawColor, bgDrawColor);
            }
            else { // Transparent Tiles 
                let lightColor: Color = lightManager.getColor(position)!;
                if (belowLayer && tile.multiplyBelow) {
                    fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, lightColor, belowBlend);
                    bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, lightColor, belowBlend);
                }
                else {
                    fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, lightColor);
                    bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, lightColor);
                }
                this.draw(position.x, position.y, tile.glyph, fgDrawColor, bgDrawColor);
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

    private multiplyAndConvertColor(color: Color | null, ...multipliers: Color[]) {
        return !color ? null : ColorHelper.toRGB(ColorHelper.multiply(color, ...multipliers));
    }
}
