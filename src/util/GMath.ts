import Point from "./Point";


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

    static lerpPoint(p0: Point, p1: Point, t: number) {
        return new Point(this.lerp(p0.x, p1.x, t), this.lerp(p0.y, p1.y, t));
    }

    static roundPoint(c: Point) {
        return new Point(Math.round(c.x), Math.round(c.y));
    }

    ///////////////////////////////////////////////////////
    // Geometry
    ///////////////////////////////////////////////////////

    static * iterateLinePoints(p0: Point, p1: Point) {
        let N = this.diagonalDistance(p0, p1);
        for (let step = 0; step <= N; step++) {
            let t = N === 0 ? 0.0 : step / N;
            yield this.roundPoint(this.lerpPoint(p0, p1, t));
        }
    }

    static lineList(p0: Point, p1: Point) {
        let points: Point[] = [];
        for (let c of GMath.iterateLinePoints(p0, p1)) {
            points.push(c);
        }
        return points;
    }

    static lineSet(p0: Point, p1: Point) {
        let Point = new Set<Point>();
        for (let c of GMath.iterateLinePoints(p0, p1)) {
            Point.add(c);
        }
        return Point;
    }



    static diagonalDistance(p0: Point, p1: Point) {
        let dx = p1.x - p0.x;
        let dy = p1.y - p0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    }

    static insideCircle(center: Point, x: number, y: number, radius: number) {
        let dx = center.x - x;
        let dy = center.y - y;
        let distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= radius * radius;
    }

    static * iteratePointWithinCircle(center: Point, radius: number) {
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

    static PointWithinCircleMap(center: Point, radius: number) {
        let map = new Map<number, Point>();

        let top = Math.floor(center.y - radius);
        let bottom = Math.floor(center.y + radius);

        for (let y = top; y <= bottom; y++) {
            let dy = y - center.y;
            let dx = Math.sqrt(radius * radius - dy * dy); // Can be precomputed if its a problem: See below
            let left = Math.ceil(center.x - dx);
            let right = Math.floor(center.x + dx);
            for (let x = left; x <= right; x++) {
                let c = new Point(x, y);
                map.set(c.key, c);
            }
        }

        return map;
    }

    private static dupePoint = new Set<number>();
    static PointOnCircumferenceSet(center: Point, radius: number) {
        this.dupePoint.clear();
        let pointSet = new Set<Point>();
        for (let r = 0; r <= Math.floor(radius * Math.SQRT1_2); r++) {
            let d = Math.floor(Math.sqrt(radius * radius - r * r)); // Can be precomputed if its a problem: See below
            this.addIfNotDupe(new Point(center.x - d, center.y + r), pointSet);
            this.addIfNotDupe(new Point(center.x + d, center.y + r), pointSet);
            this.addIfNotDupe(new Point(center.x - d, center.y - r), pointSet);
            this.addIfNotDupe(new Point(center.x + d, center.y - r), pointSet);
            this.addIfNotDupe(new Point(center.x + r, center.y - d), pointSet);
            this.addIfNotDupe(new Point(center.x + r, center.y + d), pointSet);
            this.addIfNotDupe(new Point(center.x - r, center.y - d), pointSet);
            this.addIfNotDupe(new Point(center.x - r, center.y + d), pointSet);
        }
        return pointSet;
    }

    private static addIfNotDupe(point: Point, set: Set<Point>) {
        if (!this.dupePoint.has(point.key)) {
            set.add(point);
            this.dupePoint.add(point.key);
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