import { Color as ColorHelper, Display } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import G from './../G';
import C from '../C';
import Board from './../Board';


export default class BoardDisplay extends Display {

    observedCells: Set<string> = new Set<string>();

    constructor() {
        super(C.BOARD_DISPLAY_OPTIONS);
    }

    update(board: Board, seenCells: Set<string>) {
        const tileLayer = board.tileLayer;
        const actorLayer = board.actorLayer;
        const lightManager = G.board.lightManager;

        for (let tileAndCoords of tileLayer.iterateElements()) {
            const coords = tileAndCoords[1];

            let light: Color = lightManager.getColor(coords.key) || lightManager.ambientLight;
            let brightness = lightManager.getBrightness(coords.key) || 0;


            if (G.player.getCoords()!.key == coords.key || (brightness > 0 && seenCells.has(coords.key) && actorLayer.hasCoords(coords))) {
                let actor = actorLayer.getElementViaCoords(coords);
                let fgDrawColor = actor.fgColor ? ColorHelper.toRGB(ColorHelper.multiply(actor.fgColor, light)) : null;
                let bgDrawColor = actor.bgColor ? ColorHelper.toRGB(ColorHelper.multiply(actor.bgColor, light)) : null;
                //this.draw(coords.x, coords.y, actor.glyph, fgDrawColor, bgDrawColor);
                this.draw(coords.x, coords.y, actor.glyph, actor.fgColor == null ? null : ColorHelper.toRGB(actor.fgColor), actor.bgColor == null ? null : ColorHelper.toRGB(actor.bgColor));
            } else { // Tiles 
                let tile = tileAndCoords[0];
                let fgDrawColor = tile.fgColor ? ColorHelper.toRGB(ColorHelper.multiply(tile.fgColor, light)) : null;
                let bgDrawColor = tile.bgColor ? ColorHelper.toRGB(ColorHelper.multiply(tile.bgColor, light)) : null;
                this.draw(coords.x, coords.y, tile.glyph, fgDrawColor, bgDrawColor);
            }

            // if (actorLayer.hasCoords(coords)) {
            //     let actor = actorLayer.getElementViaCoords(coords);
            //     if (seenCells.has(coords.key)) {
            //         this.observedCells.add(coords.key);
            //         let seenFg = actor.fgColor ? Color.interpolate(Color.fromString(actor.fgColor), [255, 255, 255], .35) : null;
            //         let seenBg = actor.bgColor ? Color.interpolate(Color.fromString(actor.bgColor), [255, 255, 255], .35) : null;
            //         this.draw(coords.x, coords.y, actor.glyph, seenFg ? Color.toRGB(seenFg!) : null, seenBg ? Color.toRGB(seenBg!) : null);
            //     } else {
            //         this.draw(coords.x, coords.y, actor.glyph, actor.fgColor, actor.bgColor);
            //     }
            //     // actor.draw(this);
            // } else {
            //     let tile = tileAndCoords[0];
            //     if (seenCells.has(coords.key)) {
            //         this.observedCells.add(coords.key);
            //         let seenFg = tile.fgColor ? Color.interpolate(Color.fromString(tile.fgColor), [255, 255, 255], .35) : null;
            //         let seenBg = tile.bgColor ? Color.interpolate(Color.fromString(tile.bgColor), [255, 255, 255], .35) : null;
            //         this.draw(coords.x, coords.y, tile.glyph, seenFg ? Color.toRGB(seenFg!) : null, seenBg ? Color.toRGB(seenBg!) : null);
            //     } else if (this.observedCells.has(coords.key)) {
            //         this.draw(coords.x, coords.y, tile.glyph, tile.fgColor, tile.bgColor);
            //     }
            //     // tile.draw(this);
        }
    }
}



