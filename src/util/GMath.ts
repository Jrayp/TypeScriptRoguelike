import Coords from "./Coords";


export default class GMath {

    static normalize(x: number, minX: number, maxX: number, betweenA: number = 0, betweenB: number = 1) {
        return (betweenB - betweenA) * (x - minX) / (maxX - minX) + betweenA;
    };


    static clamp(x: number, min: number, max: number) {
        return Math.min(Math.max(x, min), max);
    };

    static lerp(start: number, end: number, t: number) {
        return start + t * (end - start);
    }

    static lerpCoords(c0: Coords, c1: Coords, t: number) {
        return new Coords(this.lerp(c0.x, c1.x, t), this.lerp(c0.y, c1.y, t));
    }

    static roundCoords(c: Coords) {
        return new Coords(Math.round(c.x), Math.round(c.y));
    }

    ///////////////////////////////////////////////////////
    // Geometry
    ///////////////////////////////////////////////////////

    static * iterateLineCoords(c0: Coords, c1: Coords) {
        let N = this.diagonalDistance(c0, c1);
        for (let step = 0; step <= N; step++) {
            let t = N === 0 ? 0.0 : step / N;
            yield this.roundCoords(this.lerpCoords(c0, c1, t));
        }
    }

    static lineList(c0: Coords, c1: Coords) {
        let coords: Coords[] = [];
        for (let c of GMath.iterateLineCoords(c0, c1)) {
            coords.push(c);
        }
        return coords;
    }

    static lineSet(c0: Coords, c1: Coords) {
        let coords = new Set<Coords>();
        for (let c of GMath.iterateLineCoords(c0, c1)) {
            coords.add(c);
        }
        return coords;
    }



    static diagonalDistance(c0: Coords, c1: Coords) {
        let dx = c1.x - c0.x;
        let dy = c1.y - c0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    }

    static insideCircle(center: Coords, x: number, y: number, radius: number) {
        let dx = center.x - x;
        let dy = center.y - y;
        let distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= radius * radius;
    }

    static * iterateCoordsWithinCircle(center: Coords, radius: number) {
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

    static coordsWithinCircleMap(center: Coords, radius: number) {
        let map = new Map<number, Coords>();

        let top = Math.floor(center.y - radius);
        let bottom = Math.floor(center.y + radius);

        for (let y = top; y <= bottom; y++) {
            let dy = y - center.y;
            let dx = Math.sqrt(radius * radius - dy * dy); // Can be precomputed if its a problem: See below
            let left = Math.ceil(center.x - dx);
            let right = Math.floor(center.x + dx);
            for (let x = left; x <= right; x++) {
                let c = new Coords(x, y);
                map.set(c.key, c);
            }
        }

        return map;
    }

    private static dupeCoords = new Set<number>();
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