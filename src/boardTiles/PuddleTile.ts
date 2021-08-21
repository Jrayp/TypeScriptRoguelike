import { Color } from "rot-js";
import Actor from "src/actors/_Actor";
import Log from "./../Log";
import LogDisplay from "../displays/LogDisplay";
import { _BoardTile } from "./_BoardTile";

export class PuddleTile extends _BoardTile {
    name = 'Water';
    glyph = '~';
    fgColor = Color.toRGB([25, 100, 225]);
    bgColor = null;
    passable = true;

    onEnter(actor: Actor) {
        Log.Write("Splash! You step in a puddle...");
        return true;
    }
}