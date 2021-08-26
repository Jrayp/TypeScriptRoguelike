import { RNG } from "rot-js";
import { Color } from "rot-js/lib/color";
import _Actor from "src/actors/_Actor";
import G from "../G";
import { _BoardTile } from "./_BoardTile";

export class CavernGrassTile extends _BoardTile {
    name = 'Cavern Grass';
    glyph = '"';
    fgColor = [45, 225, 125] as Color;
    bgColor = null;
    passable = true;
    transparent = true;

    onEnter(actor: _Actor) {
        if (RNG.getUniform() < .1)
            return "*Squish* *squish* The cavern grass is spongy";
        else return undefined;

    }
}