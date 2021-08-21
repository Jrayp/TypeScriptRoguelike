import { Color } from "rot-js";
import Actor from "src/actors/_Actor";
import LogDisplay from "../displays/LogDisplay";
import { _BoardTile } from "./_BoardTile";

export class PuddleTile extends _BoardTile {
    name = 'Water';
    glyph = '~';
    fgColor = Color.toRGB([25, 100, 225]);
    bgColor = null;
    passable = true;

    onEnter(actor: Actor) {
        LogDisplay.log("Splash! You step in a puddle...");
        return true;
    }
}