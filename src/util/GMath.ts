import Point from "./Point";


export default class GMath {
    ///////////////////////////////////////////////////////
    // Basic
    ///////////////////////////////////////////////////////

    static clamp(x: number, min: number, max: number) {
        return Math.min(Math.max(x, min), max);
    };

    static normalize(x: number, minX: number, maxX: number, betweenA: number = 0, betweenB: number = 1) {
        return (betweenB - betweenA) * (x - minX) / (maxX - minX) + betweenA;
    };

    static lerp(start: number, end: number, t: number) {
        return start + t * (end - start);
    }

    static lerpPoint(p0: Point, p1: Point, t: number) {
        return new Point(GMath.lerp(p0.x, p1.x, t), GMath.lerp(p0.y, p1.y, t));
    }

    static roundPoint(c: Point) {
        return new Point(Math.round(c.x), Math.round(c.y));
    }

    ///////////////////////////////////////////////////////
    // Distance
    ///////////////////////////////////////////////////////

    static diagonalDistance(p0: Point, p1: Point) {
        let dx = p1.x - p0.x;
        let dy = p1.y - p0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    }

    ///////////////////////////////////////////////////////
    // Lines
    ///////////////////////////////////////////////////////

    static * iterateLinePoints(p0: Point, p1: Point, skipStart: number = 0, skipEnd: number = 0) {
        let N = GMath.diagonalDistance(p0, p1);
        for (let step = skipStart; step <= N - skipEnd; step++) {
            let t = N === 0 ? 0.0 : step / N;
            yield GMath.roundPoint(GMath.lerpPoint(p0, p1, t));
        }
    }

    static lineList(p0: Point, p1: Point, skipStart: number = 0, skipEnd: number = 0) {
        let points: Point[] = [];
        for (let c of GMath.iterateLinePoints(p0, p1, skipStart, skipEnd)) {
            points.push(c);
        }
        return points;
    }

    static lineSet(p0: Point, p1: Point, skipStart: number = 0, skipEnd: number = 0) {
        let Point = new Set<Point>();
        for (let c of GMath.iterateLinePoints(p0, p1, skipStart, skipEnd)) {
            Point.add(c);
        }
        return Point;
    }

    ///////////////////////////////////////////////////////
    // Circles
    ///////////////////////////////////////////////////////

    static * iteratePointsWithinCircle(center: Point, radius: number) {
        let top = Math.floor(center.y - radius);
        let bottom = Math.floor(center.y + radius);

        for (let y = top; y <= bottom; y++) {
            let dy = y - center.y;
            let dx = Math.sqrt(radius * radius - dy * dy); // Can be precomputed if its a problem: See below
            let left = Math.ceil(center.x - dx);
            let right = Math.floor(center.x + dx);
            for (let x = left; x <= right; x++) {
                yield new Point(x, y);
            }
        }
    }

    static pointWithinCircleSet(center: Point, radius: number) {
        let set = new Set<Point>();
        for (let p of GMath.iteratePointsWithinCircle(center, radius))
            set.add(p);

        return set;
    }

    static pointWithinCircleMap(center: Point, radius: number) {
        let map = new Map<number, Point>();
        for (let p of GMath.iteratePointsWithinCircle(center, radius))
            map.set(p.key, p);

        return map;
    }

    static pointIsInsideCircle(center: Point, x: number, y: number, radius: number) {
        let dx = center.x - x;
        let dy = center.y - y;
        let distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= radius * radius;
    }

    ///////////////////////////////////////////////////////
    // Circumference
    ///////////////////////////////////////////////////////

    static * iteratePointsOnCircumference(center: Point, radius: number) {
        let dupes = new Set<number>();
        for (let r = 0; r <= Math.floor(radius * Math.SQRT1_2); r++) {
            let d = Math.floor(Math.sqrt(radius * radius - r * r)); // Can be precomputed if its a problem: See below
            if (r == 0 || r == d) {
                let p0 = new Point(center.x - d, center.y + r);
                let p1 = new Point(center.x + d, center.y + r);
                let p2 = new Point(center.x - d, center.y - r);
                let p3 = new Point(center.x + d, center.y - r);
                let p4 = new Point(center.x + r, center.y - d);
                let p5 = new Point(center.x + r, center.y + d);
                let p6 = new Point(center.x - r, center.y - d);
                let p7 = new Point(center.x - r, center.y + d);

                if (!dupes.has(p0.key)) {
                    dupes.add(p0.key)
                    yield p0;
                }
                if (!dupes.has(p1.key)) {
                    dupes.add(p1.key)
                    yield p1;
                }
                if (!dupes.has(p2.key)) {
                    dupes.add(p2.key)
                    yield p2;
                }
                if (!dupes.has(p3.key)) {
                    dupes.add(p3.key)
                    yield p3;
                }
                if (!dupes.has(p4.key)) {
                    dupes.add(p4.key)
                    yield p4;
                }
                if (!dupes.has(p5.key)) {
                    dupes.add(p5.key)
                    yield p5;
                }
                if (!dupes.has(p6.key)) {
                    dupes.add(p6.key)
                    yield p6;
                }
                if (!dupes.has(p7.key)) {
                    dupes.add(p7.key)
                    yield p7;
                }
            }
            else {
                yield new Point(center.x - d, center.y + r);
                yield new Point(center.x + d, center.y + r);
                yield new Point(center.x - d, center.y - r);
                yield new Point(center.x + d, center.y - r);
                yield new Point(center.x + r, center.y - d);
                yield new Point(center.x + r, center.y + d);
                yield new Point(center.x - r, center.y - d);
                yield new Point(center.x - r, center.y + d);
            }
        }
    }

    static pointsOnCircumferenceSet(center: Point, radius: number) {
        let pointSet = new Set<Point>();
        for (let p of GMath.iteratePointsOnCircumference(center, radius))
            pointSet.add(p);
        return pointSet;
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