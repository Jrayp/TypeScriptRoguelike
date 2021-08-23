import G from "./G";
import Coords from "./util/Coords";


export default class Light {


    private lightPasses(x: number, y: number) {
        const key = Coords.makeKey(x, y);
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tileLayer.getElementViaKey(key).transparent;
    }

}