import { assertTrue } from "./Assertions";
import Cell from "./Cell";


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

    static lerpCell(p0: Cell, p1: Cell, t: number) {
        assertTrue(p0.layer == p1.layer);
        let x = Math.round(GMath.lerp(p0.x, p1.x, t));
        let y = Math.round(GMath.lerp(p0.y, p1.y, t));
        return Cell.get(x, y, p0.layer);
    }

    ///////////////////////////////////////////////////////
    // Distance
    ///////////////////////////////////////////////////////

    static diagonalDistance(p0: Cell, p1: Cell) {
        let dx = p1.x - p0.x;
        let dy = p1.y - p0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    }

    ///////////////////////////////////////////////////////
    // Lines
    ///////////////////////////////////////////////////////

    static * iterateLineCells(p0: Cell, p1: Cell, skipStart: number = 0, skipEnd: number = 0) {
        let N = GMath.diagonalDistance(p0, p1);
        for (let step = skipStart; step <= N - skipEnd; step++) {
            let t = N === 0 ? 0.0 : step / N;
            let lerpedCell = GMath.lerpCell(p0, p1, t);
            if (lerpedCell)
                yield lerpedCell;
        }
    }

    static lineList(p0: Cell, p1: Cell, skipStart: number = 0, skipEnd: number = 0) {
        let cells: Cell[] = [];
        for (let p of GMath.iterateLineCells(p0, p1, skipStart, skipEnd)) {
            cells.push(p);
        }
        return cells;
    }

    static lineSet(p0: Cell, p1: Cell, skipStart: number = 0, skipEnd: number = 0) {
        let Cell = new Set<Cell>();
        for (let c of GMath.iterateLineCells(p0, p1, skipStart, skipEnd)) {
            Cell.add(c);
        }
        return Cell;
    }

    ///////////////////////////////////////////////////////
    // Circles
    ///////////////////////////////////////////////////////

    static * iterateCellsWithinCircle(center: Cell, radius: number) {
        let top = Math.floor(center.y - radius);
        let bottom = Math.floor(center.y + radius);

        for (let y = top; y <= bottom; y++) {
            let dy = y - center.y;
            let dx = Math.sqrt(radius * radius - dy * dy); // Can be precomputed if its a problem: See below
            let left = Math.ceil(center.x - dx);
            let right = Math.floor(center.x + dx);
            for (let x = left; x <= right; x++) {
                let cell = Cell.get(x, y, center.layer);
                if (cell)
                    yield cell;
            }
        }
    }

    static cellWithinCircleSet(center: Cell, radius: number) {
        let set = new Set<Cell>();
        for (let p of GMath.iterateCellsWithinCircle(center, radius))
            set.add(p);
        return set;
    }

    static cellIsInsideCircle(center: Cell, x: number, y: number, radius: number) {
        let dx = center.x - x;
        let dy = center.y - y;
        let distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= radius * radius;
    }

    ///////////////////////////////////////////////////////
    // Circumference
    ///////////////////////////////////////////////////////

    static * iterateCellsOnCircumference(center: Cell, radius: number) {
        let dupes = new Set<Cell>();
        for (let r = 0; r <= Math.floor(radius * Math.SQRT1_2); r++) {
            let d = Math.floor(Math.sqrt(radius * radius - r * r)); // Can be precomputed if its a problem: See below

            let p0 = Cell.get(center.x - d, center.y + r, center.layer);
            let p1 = Cell.get(center.x + d, center.y + r, center.layer);
            let p2 = Cell.get(center.x - d, center.y - r, center.layer);
            let p3 = Cell.get(center.x + d, center.y - r, center.layer);
            let p4 = Cell.get(center.x + r, center.y - d, center.layer);
            let p5 = Cell.get(center.x + r, center.y + d, center.layer);
            let p6 = Cell.get(center.x - r, center.y - d, center.layer);
            let p7 = Cell.get(center.x - r, center.y + d, center.layer);

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

    static cellsOnCircumferenceSet(center: Cell, radius: number) {
        let cellSet = new Set<Cell>();
        for (let p of GMath.iterateCellsOnCircumference(center, radius))
            cellSet.add(p);
        return cellSet;
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