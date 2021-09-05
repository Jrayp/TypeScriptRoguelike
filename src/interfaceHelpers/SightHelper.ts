import Point from "../util/Point";
import ISight from "../interfaces/ISight";
import G from "./../G";

export default class SightHelper {

    static computeFovNpc(sight: ISight) {
        const sightImplmenterPoint = sight.position;
        sight.seenPoint.clear();
        if (sightImplmenterPoint) {
            sight.fovAlgo.compute(sightImplmenterPoint.x, sightImplmenterPoint.y, sight.sightRange,
                (x: number, y: number, r: number, visibility: number) => {
                    let pointKey = Point.toInt(x, y);
                    if (G.board.tiles.getElementViaKey(pointKey).transparent && G.board.lights.getBrightness(pointKey))
                        sight.seenPoint.add(pointKey); // Npc's only care about seeing transparent tiles
                });
            sight.seenPoint.add(sightImplmenterPoint.key); // Always see own Point
        }
        return sight.seenPoint;
    }

    static sightPassesCallback(x: number, y: number) {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tiles.getElementViaKey(Point.toInt(x, y)).transparent;
    }

}