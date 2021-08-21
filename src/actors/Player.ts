import Log from "./../Log";
import Actor from "./_Actor";

export default class Player extends Actor {

    glyph = '\u263B';
    fgColor = 'yellow'
    bgColor = null;

    move(newPos: number) {
        if (super.move(newPos))
            return true;
        else {
            Log.Write("Ouch! You ran into a wall!")
            return false
        }
    }

}