import { Color, RNG } from "rot-js";
import _Actor from "src/actors/_Actor";
import Log from "./../Log";
import LogDisplay from "../displays/LogDisplay";
import { _BoardTile } from "./_BoardTile";
import G from "./../G";

export class PuddleTile extends _BoardTile {
    name = 'Water';
    glyph = '~';
    fgColor = Color.toRGB([20, 75, 210]);
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