import LogDisplay from "./../LogDisplay";
import Actor from "./Actor";

export default class Player extends Actor {

    glyph = '@';
    fg = 'yellow'

    move(newPos: number) {
        if (super.move(newPos))
            return true;
        else {
            LogDisplay.log("Ouch! You ran into a wall!")
            return false
        }
    }

}