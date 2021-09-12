import { NamedTupleMember } from "typescript";
import { assertTrue } from "./Assertions";
import GMath from "./GMath";
import Point from "./Point";

export default class UniquePointMap<T>{
    protected _elementToPoint: Map<T, Point> = new Map();
    protected _keyToElement: Map<number, T> = new Map();

    get count() {
        return this._keyToElement.size;
    }

    ///////////////////////////////////////////////////////
    // Setting and removal
    ///////////////////////////////////////////////////////

    set(point: Point, element: T) {
        assertTrue(Number.isInteger(point.x) && Number.isInteger(point.y) && Number.isInteger(point.layer), `x, y and layer must be integers. Passed: ${point.toString()}`);
        assertTrue(this._keyToElement.has(point.key) === false, `There is already an element at  ${point.toString()}`);
        assertTrue(this._elementToPoint.has(element) === false, `There is already a point at ${point.toString()}`);
        this._keyToElement.set(point.key, element);
        this._elementToPoint.set(element, point);
    }

    removeViaKey(key: number) {
        let element = this._keyToElement.get(key)!;
        this._keyToElement.delete(key);
        this._elementToPoint.delete(element);
    }

    removeViaElement(element: T) {
        const point = this._elementToPoint.get(element)!;
        this._elementToPoint.delete(element);
        this._keyToElement.delete(point.key);
    }

    removeViaPoint(point: Point) {
        let element = this._keyToElement.get(point.key)!;
        this._keyToElement.delete(point.key);
        this._elementToPoint.delete(element);
    }

    clear() {
        this._elementToPoint.clear();
        this._keyToElement.clear();
    }


    ///////////////////////////////////////////////////////
    // Existance
    ///////////////////////////////////////////////////////

    hasKey(key: number) {
        return this._keyToElement.has(key);
    }

    hasElement(element: T) {
        return this._elementToPoint.has(element);
    }

    hasPoint(point: Point) {
        return this._keyToElement.has(point.key);
    }

    hasXYZ(x: number, y: number, z: number) {
        return this._keyToElement.has(Point.computeKeyFromXYL(x, y, z));
    }

    ///////////////////////////////////////////////////////
    // Retrieval
    ///////////////////////////////////////////////////////

    getElementViaKey(key: number): T {
        // TODO: The messages are super slow
        assertTrue(this._keyToElement.has(key), `No element found at key value ${key}. Point value: ${Point.getFromKey(key).toString()}`);
        return this._keyToElement.get(key)!;
    }

    getElementViaPoint(point: Point): T {
        assertTrue(this._keyToElement.has(point.key), `No element found at ${point.toString()}.`);
        return this._keyToElement.get(point.key)!;
    }

    getElementViaXYZ(x: number, y: number, z: number): T {
        const key = Point.computeKeyFromXYL(x, y, z);
        assertTrue(this._keyToElement.has(key));
        return this._keyToElement.get(key)!;
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
        assertTrue(this._keyToElement.has(destPoint.key) === false, `Can't move element to ${destPoint.toString()} as there is already an element at the destination.`);
        this.removeViaElement(element);
        this.set(destPoint, element);
    }

    ///////////////////////////////////////////////////////
    // Iterators & Generators
    ///////////////////////////////////////////////////////

    iterateElements() {
        return [...this._elementToPoint];
    }

    * iterateSurrounding(point: Point): Generator<[Point, T | undefined]> {
        for (let p of point.iterateNeighbors()) {
            const e = this._keyToElement.get(p.key);
            yield [p, e];
        }
    }

    * iterateCircle(center: Point, radius: number): Generator<[Point, T | undefined]> {
        for (let p of GMath.iteratePointsWithinCircle(center, radius))
            yield [p, this._keyToElement.get(p.key)];
    }

    * iterateCircumference(center: Point, radius: number): Generator<[Point, T | undefined]> {
        for (let p of GMath.iteratePointsOnCircumference(center, radius))
            yield [p, this._keyToElement.get(p.key)];
    }
}


