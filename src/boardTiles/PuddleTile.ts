import { RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import _Actor from "src/actors/_Actor";
import G from "../G";
import { _BoardTile } from "./_BoardTile";

export class PuddleTile extends _BoardTile {
    name = 'Water';
    glyph = '~';
    fgColor = [20, 75, 210] as Color;
    bgColor = null;
    passable = true;
    transparent = true;

    onEnter(actor: _Actor) {
        if (RNG.getUniform() < .98)
            G.log.write("Splash! You wade through some water...");
        else
            G.log.write("SOMETHING GRABS YOUR LEG!! And lets go.. for now.");
        return true;
    }
}