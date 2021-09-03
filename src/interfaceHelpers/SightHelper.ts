import Coords from "./../util/Coords";
import ISight from "../interfaces/ISight";
import G from "./../G";

export default class SightHelper {

    static computeFovNpc(sight: ISight) {
        const sightImplmenterCoords = sight.coords;
        sight.seenCoords.clear();
        if (sightImplmenterCoords) {
            sight.fovAlgo.compute(sightImplmenterCoords.x, sightImplmenterCoords.y, sight.sightRange,
                (x: number, y: number, r: number, visibility: number) => {
                    let coordsKey = Coords.makeKey(x, y);
                    if (G.board.tiles.getElementViaKey(coordsKey).transparent && G.board.lights.getBrightness(coordsKey))
                        sight.seenCoords.add(coordsKey); // Npc's only care about seeing transparent tiles
                });
            sight.seenCoords.add(sightImplmenterCoords.key); // Always see own coords
        }
        return sight.seenCoords;
    }

    static sightPassesCallback(x: number, y: number) {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tiles.getElementViaKey(Coords.makeKey(x, y)).transparent;
    }

}