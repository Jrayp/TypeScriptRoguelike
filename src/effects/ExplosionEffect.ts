import { Color as ColorHelper, RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import { RubbleTile } from "./../boardTiles/RubbleTile";
import _EffectGenerator from "./../effects/_EffectGenerator";
import G from "../G";
import Light from "../lights/Light";
import _Effect from "./_Effect";
import { _BoardTile } from "src/boardTiles/_BoardTile";
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";

export default class ExplosionEffect extends _Effect {
    _glyph = '#'
    _fgColor: Color | null = null;
    _bgColor: Color | null = null;

    light: Light;

    counter = 0;
    tile: _BoardTile; // This should prob be set in the constructor to force adding due to the race condition

    constructor() {
        super();
        this._fgColor = ColorHelper.randomize([255, 100, 22], 25) as Color;
        this._bgColor = ColorHelper.randomize([235, 155, 15], 25) as Color;
        this.light = new Light(this, 12, ColorHelper.interpolate(this._fgColor, this._bgColor, .5));
        G.board.lights.addLight(this.light);
    }

    doStep() {
        if (this.counter == 1) {
            let tile = G.board.tiles.getElementViaPoint(this.position);
            if (tile.destroyable)
                if (tile.passable)
                    G.board.tiles.replace(this.position, new RubbleTile(ColorHelper.randomize([30, 30, 30], 8)));
                else if (RNG.getUniform() < .75)
                    G.board.tiles.replace(this.position, new RubbleTile(ColorHelper.randomize([30, 30, 30], 8)));
            if (G.board.actors.hasPoint(this.position)) {
                let actor = G.board.actors.getElementViaPoint(this.position);
                actor.kill();
            }

        }
        else if (this.counter == 2) {
            this._glyph = '*';
        }
        else if (this.counter == 3) {
            this._bgColor = null;
            G.board.lights.removeLight(this.light);

        }
        else if (this.counter == 4) {
            G.board.effects.removeViaElement(this);

        }
        this.counter++;
    }


}