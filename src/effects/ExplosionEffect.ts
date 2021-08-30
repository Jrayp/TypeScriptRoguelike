import { Color } from "rot-js/lib/color";
import G from "../G";
import Light from "../lights/Light";
import _Effect from "./_Effect";

export default class ExplosionAction extends _Effect {
    _glyph = '*'
    _fgColor = [255, 165, 22] as Color;
    _bgColor = null;

    light: Light;

    constructor() {
        super();
        this.light = new Light(this, 6, [255, 200, 40]);
        G.board.lights.addLight(this.light);
    }

    doStep() {
        const coords = this.coords;
        
        
        
        // const tile = G.board.tileLayer.getElementViaCoords(coords);
        // if (!tile.passable || tile.occupant()) {
        //     this.explode();
        // }
        // else {
        //     let dest = Coords.addCoordsToCoords(coords, GMath.DIR_COORDS[Direction.N])
        //     G.board.actionLayer.moveElement(this, dest);
        // }
    }

}