import { Z_ASCII } from "zlib";
import Coords from "./Coords";

export default class GMath {

    static readonly DIR_COORDS = [
        new Coords(0, -1),
        new Coords(1, -1),
        new Coords(1, 0),
        new Coords(1, 1),
        new Coords(0, 1),
        new Coords(-1, 1),
        new Coords(-1, 0),
        new Coords(-1, -1),
    ]

    static normalize(x: number, minX: number, maxX: number, betweenA: number = 0, betweenB: number = 1) {
        return (betweenB - betweenA) * (x - minX) / (maxX - minX) + betweenA;
    };


    static clamp(x: number, min: number, max: number) {
        return Math.min(Math.max(x, min), max);
    };

    static insideCircle(center: Coords, x: number, y: number, radius: number) {
        let dx = center.x - x;
        let dy = center.y - y;
        let distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= radius * radius;
    }

    static *iterateCoordsWithinCircle(center: Coords, radius: number) {
        let top = Math.floor(center.y - radius);
        let bottom = Math.floor(center.y + radius);

        for (let y = top; y <= bottom; y++) {
            let dy = y - center.y;
            let dx = Math.sqrt(radius * radius - dy * dy); // Can be precomputed if its a problem: See below
            let left = Math.ceil(center.x - dx);
            let right = Math.floor(center.x + dx);
            for (let x = left; x <= right; x++) {
                yield new Coords(x, y);
            }
        }
    }

    private static dupeCoords = new Set<string>();
    static coordsOnCircumferenceSet(center: Coords, radius: number) {
        this.dupeCoords.clear();
        let coordsSet = new Set<Coords>();
        for (let r = 0; r <= Math.floor(radius * Math.SQRT1_2); r++) {
            let d = Math.floor(Math.sqrt(radius * radius - r * r)); // Can be precomputed if its a problem: See below
            this.addIfNotDupe(new Coords(center.x - d, center.y + r), coordsSet);
            this.addIfNotDupe(new Coords(center.x + d, center.y + r), coordsSet);
            this.addIfNotDupe(new Coords(center.x - d, center.y - r), coordsSet);
            this.addIfNotDupe(new Coords(center.x + d, center.y - r), coordsSet);
            this.addIfNotDupe(new Coords(center.x + r, center.y - d), coordsSet);
            this.addIfNotDupe(new Coords(center.x + r, center.y + d), coordsSet);
            this.addIfNotDupe(new Coords(center.x - r, center.y - d), coordsSet);
            this.addIfNotDupe(new Coords(center.x - r, center.y + d), coordsSet);
        }
        return coordsSet;
    }

    private static addIfNotDupe(coords: Coords, set: Set<Coords>) {
        if (!this.dupeCoords.has(coords.key)) {
            set.add(coords);
            this.dupeCoords.add(coords.key);
        }
    }
}

// Could precompute sqrt as such:
// dx = [
//     [0], /* radius = 0.5 */
//     [1,1], /* radius = 1.5 */
//     [2,2,1], /* radius = 2.5 */
//     [3,3,2,1], /* radius = 3.5 */
//     [4,4,4,3,2], /* radius = 4.5 */
//     [5,5,5,4,3,2], /* radius = 5.5 */
//     [6,6,6,5,5,4,2], /* radius = 6.5 */
//     …
//   ];