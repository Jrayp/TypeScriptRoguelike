import Coords from "./../util/Coords";
import Sight from "./../interfaces/Sight";
import G from "./../G";

export default class SightHelper {

    static computeFov(sight: Sight) {
        const coords = sight.getCoords();
        sight.currentlySeenCoordKeys.clear();
        if (coords) {
            sight.fov.compute(coords.x, coords.y, sight.sightRange,
                (x: number, y: number, r: number, visibility: number) => {
                    sight.currentlySeenCoordKeys.add(Coords.makeKey(x, y));
                });
        }
        return sight.currentlySeenCoordKeys;
    }

    static sightPassesCallback(x: number, y: number) {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tileLayer.getElementViaKey(Coords.makeKey(x, y)).transparent;
    }

}