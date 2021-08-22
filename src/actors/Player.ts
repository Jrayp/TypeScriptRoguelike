import Coords from "./../util/Coords";
import G from "./../G";
import Log from "./../Log";
import _Actor from "./_Actor";

export default class Player extends _Actor {

    glyph = '\u263B';
    fgColor = 'yellow'
    bgColor = null;

    move(newCoords: Coords) {
        if (super.move(newCoords))
            return true;
        else {
            G.log.write("Ouch! You run into a wall!")
            return false
        }
    }

}