import LogDisplay from "../displays/LogDisplay";
import Actor from "./_Actor";

export default class Player extends Actor {

    glyph = '@';
    fgColor = 'yellow'
    bgColor = null;

    move(newPos: number) {
        if (super.move(newPos))
            return true;
        else {
            LogDisplay.log("Ouch! You ran into a wall!")
            return false
        }
    }

}