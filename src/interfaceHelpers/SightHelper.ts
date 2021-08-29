import Coords from "./../util/Coords";
import Sight from "./../interfaces/Sight";
import G from "./../G";

export default class SightHelper {

    static computeFovNpc(sight: Sight) {
        const sightImplmenterCoords = sight.coords;
        sight.seenCoords.clear();
        if (sightImplmenterCoords) {
            sight.fov.compute(sightImplmenterCoords.x, sightImplmenterCoords.y, sight.sightRange,
                (x: number, y: number, r: number, visibility: number) => {
                    let coordsKey = Coords.makeKey(x, y);
                    if (G.board.tileLayer.getElementViaKey(coordsKey).transparent && G.board.lightManager.getBrightness(coordsKey)) // Only seen if there is light
                        sight.seenCoords.add(coordsKey); // Npc's only care about seeing transparent tiles
                });
        }
        return sight.seenCoords;
    }

    static sightPassesCallback(x: number, y: number) {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tileLayer.getElementViaKey(Coords.makeKey(x, y)).transparent;
    }

}