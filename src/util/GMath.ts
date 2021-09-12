import { assertTrue } from "./Assertions";
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
        assertTrue(p0.layer == p1.layer);
        let x = Math.round(GMath.lerp(p0.x, p1.x, t));
        let y = Math.round(GMath.lerp(p0.y, p1.y, t));
        return Point.get(x, y, p0.layer);
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
            let lerpedPoint = GMath.lerpPoint(p0, p1, t);
            if (lerpedPoint)
                yield lerpedPoint;
        }
    }

    static lineList(p0: Point, p1: Point, skipStart: number = 0, skipEnd: number = 0) {
        let points: Point[] = [];
        for (let p of GMath.iterateLinePoints(p0, p1, skipStart, skipEnd)) {
            points.push(p);
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
                let point = Point.get(x, y, center.layer);
                if (point)
                    yield point;
            }
        }
    }

    static pointWithinCircleSet(center: Point, radius: number) {
        let set = new Set<Point>();
        for (let p of GMath.iteratePointsWithinCircle(center, radius))
            set.add(p);
        return set;
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
        let dupes = new Set<Point>();
        for (let r = 0; r <= Math.floor(radius * Math.SQRT1_2); r++) {
            let d = Math.floor(Math.sqrt(radius * radius - r * r)); // Can be precomputed if its a problem: See below

            let p0 = Point.get(center.x - d, center.y + r, center.layer);
            let p1 = Point.get(center.x + d, center.y + r, center.layer);
            let p2 = Point.get(center.x - d, center.y - r, center.layer);
            let p3 = Point.get(center.x + d, center.y - r, center.layer);
            let p4 = Point.get(center.x + r, center.y - d, center.layer);
            let p5 = Point.get(center.x + r, center.y + d, center.layer);
            let p6 = Point.get(center.x - r, center.y - d, center.layer);
            let p7 = Point.get(center.x - r, center.y + d, center.layer);

            if (r == 0 || r == d) {
                if (p0 && !dupes.has(p0)) {
                    dupes.add(p0)
                    yield p0;
                }
                if (p1 && !dupes.has(p1)) {
                    dupes.add(p1)
                    yield p1;
                }
                if (p2 && !dupes.has(p2)) {
                    dupes.add(p2)
                    yield p2;
                }
                if (p3 && !dupes.has(p3)) {
                    dupes.add(p3)
                    yield p3;
                }
                if (p4 && !dupes.has(p4)) {
                    dupes.add(p4)
                    yield p4;
                }
                if (p5 && !dupes.has(p5)) {
                    dupes.add(p5)
                    yield p5;
                }
                if (p6 && !dupes.has(p6)) {
                    dupes.add(p6)
                    yield p6;
                }
                if (p7 && !dupes.has(p7)) {
                    dupes.add(p7)
                    yield p7;
                }
            }
            else {
                if (p0) yield p0;
                if (p1) yield p1;
                if (p2) yield p2;
                if (p3) yield p3;
                if (p4) yield p4;
                if (p5) yield p5;
                if (p6) yield p6;
                if (p7) yield p7;
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