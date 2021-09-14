import { assertTrue } from "./Assertions";
import GMath from "./GMath";
import Point from "./Point";

export default class UniquePointMap<T>{
    protected _elementToPoint: Map<T, Point> = new Map();
    protected _pointToElement: Map<Point, T> = new Map();

    get count() {
        return this._elementToPoint.size;
    }

    ///////////////////////////////////////////////////////
    // Setting and removal
    ///////////////////////////////////////////////////////

    set(point: Point, element: T) {
        assertTrue(this._pointToElement.has(point) === false);
        assertTrue(this._elementToPoint.has(element) === false);
        this._pointToElement.set(point, element);
        this._elementToPoint.set(element, point);
    }

    removeViaElement(element: T) {
        assertTrue(this._elementToPoint.has(element))
        const point = this._elementToPoint.get(element)!;
        this._elementToPoint.delete(element);
        this._pointToElement.delete(point);
    }

    removeViaPoint(point: Point) {
        assertTrue(this._pointToElement.has(point));
        let element = this._pointToElement.get(point)!;
        this._pointToElement.delete(point);
        this._elementToPoint.delete(element);
    }

    clear() {
        this._elementToPoint.clear();
        this._pointToElement.clear();
    }


    ///////////////////////////////////////////////////////
    // Existance
    ///////////////////////////////////////////////////////

    hasElement(element: T) {
        return this._elementToPoint.has(element);
    }

    hasPoint(point: Point) {
        return this._pointToElement.has(point);
    }

    hasXYZ(x: number, y: number, z: number) {
        return this._pointToElement.has(Point.get(x, y, z)!);
    }

    ///////////////////////////////////////////////////////
    // Retrieval
    ///////////////////////////////////////////////////////

    getElementViaPoint(point: Point): T {
        assertTrue(this._pointToElement.has(point));
        return this._pointToElement.get(point)!;
    }

    getElementViaXYZ(x: number, y: number, z: number): T {
        const point = Point.get(x, y, z)!;
        assertTrue(this._pointToElement.has(point));
        return this._pointToElement.get(point)!;
    }

    getPointViaElement(element: T): Point | undefined {
        return this._elementToPoint.get(element);
    }

    ///////////////////////////////////////////////////////
    // Altering
    ///////////////////////////////////////////////////////

    replace(point: Point, element: T) {
        this.removeViaPoint(point);
        this.set(point, element);
    }

    moveElementToPoint(element: T, destPoint: Point) {
        assertTrue(this._elementToPoint.has(element),);
        assertTrue(this._pointToElement.has(destPoint) === false);
        this.removeViaElement(element);
        this.set(destPoint, element);
    }

    ///////////////////////////////////////////////////////
    // Iterators & Generators
    ///////////////////////////////////////////////////////

    iterateElements() {
        return [...this._elementToPoint];
    }

    * iterateSurroundingPlane(center: Point): Generator<[Point, T | undefined]> {
        for (let p of center.iterateNeighbors()) {
            const e = this._pointToElement.get(p);
            yield [p, e];
        }
    }

    * iterateCircle(center: Point, radius: number): Generator<[Point, T | undefined]> {
        for (let p of GMath.iteratePointsWithinCircle(center, radius))
            yield [p, this._pointToElement.get(p)];
    }

    * iterateCircumference(center: Point, radius: number): Generator<[Point, T | undefined]> {
        for (let p of GMath.iteratePointsOnCircumference(center, radius))
            yield [p, this._pointToElement.get(p)];
    }
}


