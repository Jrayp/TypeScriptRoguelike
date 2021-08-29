import { Color as ColorHelper, Display } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import _Actor from 'src/actors/_Actor';
import { _BoardTile } from 'src/boardTiles/_BoardTile';
import C from '../C';
import Board from './../Board';
import G from './../G';


export default class BoardDisplay extends Display {

    observedCells: Set<string> = new Set<string>();

    constructor() {
        super(C.BOARD_DISPLAY_OPTIONS);
    }

    // TODO: only need to draw whats in fov...
    update(board: Board, seenCells: Set<string>) {
        const tileLayer = board.tileLayer;
        const actorLayer = board.actorLayer;
        const lightManager = G.board.lightManager;
        const actionLayer = G.board.actionLayer;

        this.clear();

        let actor: _Actor;
        let tile: _BoardTile;

        let fgDrawColor: string | null;
        let bgDrawColor: string | null;

        for (let tileAndCoords of tileLayer.iterateElements()) {
            const coords = tileAndCoords[1];
            const tile = tileAndCoords[0];

            let light: Color = lightManager.getColor(coords.key) || lightManager.ambientLight;
            let brightness = lightManager.getBrightness(coords.key) || 0;

            if (brightness > 0 && seenCells.has(coords.key) && actionLayer.hasCoords(coords)) {
                let action = actionLayer.getElementViaCoords(coords);
                fgDrawColor = action.fgColor == null ? null : ColorHelper.toRGB(action.fgColor);
                bgDrawColor = action.bgColor == null ? null : ColorHelper.toRGB(action.bgColor);
                this.draw(coords.x, coords.y, action.glyph, fgDrawColor, bgDrawColor);
            }
            else if (G.player.coords?.key == coords.key || (brightness > 0 && seenCells.has(coords.key) && actorLayer.hasCoords(coords))) {
                actor = actorLayer.getElementViaCoords(coords);
                // TODO: Get draw data from actor
                fgDrawColor = actor.fgColor == null ? null : ColorHelper.toRGB(actor.fgColor);
                bgDrawColor = actor.bgColor == null ? null : ColorHelper.toRGB(actor.bgColor);
                this.draw(coords.x, coords.y, actor.glyph, fgDrawColor, bgDrawColor);
            }
            else if (seenCells.has(coords.key) && !tile.transparent) { // Walls etc 
                let percievedLightColor = G.board.lightManager.percievedLightColorOfOpaque(tile, G.player);
                if (percievedLightColor) {
                    // TODO: Get draw data from tile
                    fgDrawColor = tile.fgColor ? ColorHelper.toRGB(ColorHelper.multiply(tile.fgColor, percievedLightColor)) : null;
                    bgDrawColor = tile.bgColor ? ColorHelper.toRGB(ColorHelper.multiply(tile.bgColor, percievedLightColor)) : null;
                    this.draw(coords.x, coords.y, tile.glyph, fgDrawColor, bgDrawColor);
                    // this.observedCells.add(coords.key);
                }
            }
            else if (brightness > 0 && seenCells.has(coords.key)) { // Opaque Tiles 
                // TODO: Get draw data from tile
                fgDrawColor = tile.fgColor ? ColorHelper.toRGB(ColorHelper.multiply(tile.fgColor, light)) : null;
                bgDrawColor = tile.bgColor ? ColorHelper.toRGB(ColorHelper.multiply(tile.bgColor, light)) : null;
                this.draw(coords.x, coords.y, tile.glyph, fgDrawColor, bgDrawColor);
                // this.observedCells.add(coords.key);
            }
            // else if (this.observedCells.has(coords.key)) {
            //     tile = tileAndCoords[0];
            //     fgDrawColor = tile.fgColor ? ColorHelper.toRGB(tile.fgColor) : null;
            //     bgDrawColor = tile.bgColor ? ColorHelper.toRGB(tile.bgColor) : null;
            //     this.draw(coords.x, coords.y, tile.glyph, fgDrawColor, bgDrawColor);
            // }

        }
    }
}



// if (G.player.getCoords()?.key == coords.key || (brightness > 0 && seenCells.has(coords.key) && actorLayer.hasCoords(coords))) {
//     actor = actorLayer.getElementViaCoords(coords);
//     fgDrawColor = actor.fgColor == null ? null : ColorHelper.toRGB(actor.fgColor);
//     bgDrawColor = actor.bgColor == null ? null : ColorHelper.toRGB(actor.bgColor);
//     this.draw(coords.x, coords.y, actor.glyph, fgDrawColor, bgDrawColor);
// }
// else if (this.observedCells.has(coords.key)) {
//     tile = tileAndCoords[0];
//     let fgInterim = tile.fgColor ? ColorHelper.multiply(tile.fgColor, light) : null;
//     if (fgInterim) {
//         fgInterim![0] = GMath.clamp(fgInterim[0], tile.fgColor![0], 255);
//         fgInterim![1] = GMath.clamp(fgInterim[1], tile.fgColor![1], 255);
//         fgInterim![2] = GMath.clamp(fgInterim[2], tile.fgColor![2], 255);
//     }
//     let bgInterim = tile.bgColor ? ColorHelper.multiply(tile.bgColor, light) : null;
//     if (bgInterim) {
//         bgInterim![0] = GMath.clamp(bgInterim[0], tile.bgColor![0], 255);
//         bgInterim![1] = GMath.clamp(bgInterim[1], tile.bgColor![1], 255);
//         bgInterim![2] = GMath.clamp(bgInterim[2], tile.bgColor![2], 255);
//     }
//     fgDrawColor = fgInterim == null ? null : ColorHelper.toRGB(fgInterim);//fgInterim ? ColorHelper.toRGB(ColorHelper.multiply(tile.fgColor, light)) : null;
//     bgDrawColor = bgInterim == null ? null : ColorHelper.toRGB(bgInterim); //bgInterim ? ColorHelper.toRGB(ColorHelper.multiply(tile.bgColor, light)) : null;
//     this.draw(coords.x, coords.y, tile.glyph, fgDrawColor, bgDrawColor);
// }
// else if (brightness > 0 && seenCells.has(coords.key)) { // Tiles 
//     tile = tileAndCoords[0];
//     fgDrawColor = tile.fgColor ? ColorHelper.toRGB(ColorHelper.multiply(tile.fgColor, light)) : null;
//     bgDrawColor = tile.bgColor ? ColorHelper.toRGB(ColorHelper.multiply(tile.bgColor, light)) : null;
//     this.draw(coords.x, coords.y, tile.glyph, fgDrawColor, bgDrawColor);
//     this.observedCells.add(coords.key);
// }