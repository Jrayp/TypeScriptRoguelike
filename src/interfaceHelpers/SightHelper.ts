import Point from "../util/Point";
import ISight from "../interfaces/ISight";
import G from "./../G";

export default class SightHelper {

    static computeFovNpc(sight: ISight) {
        const sightImplmenterPoint = sight.position;
        sight.seenPoints.clear();
        if (sightImplmenterPoint) {
            sight.fovAlgo.compute(sightImplmenterPoint.x, sightImplmenterPoint.y, sight.sightRange,
                (x: number, y: number, r: number, visibility: number) => {
                    let pointKey = Point.toKey(x, y, sight.position!.layer);
                    if (G.board.tiles.getElementViaKey(pointKey).transparent && G.board.lights.getBrightness(pointKey))
                        sight.seenPoints.add(pointKey); // Npc's only care about seeing transparent tiles
                });
            sight.seenPoints.add(sightImplmenterPoint.key); // Always see own Point
        }
        return sight.seenPoints;
    }

    // static sightPassesCallback(x: number, y: number) {
    //     if (!G.board.numbersWithinBounds(x, y))
    //         return false;
    //     else
    //         return G.board.tiles.getElementViaKey(Point.toInt(x, y)).transparent;
    // }

}