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
        assertTrue(Number.isInteger(point.x) && Number.isInteger(point.y), `x and y must be Integers. Passed: (${point.key})`);
        assertTrue(this._keyToElement.has(point.key) === false, `There is already an element at ${point.key}`);
        assertTrue(this._elementToPoint.has(element) === false, `There are already Point at ${this._elementToPoint.get(element)}`);
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

    ///////////////////////////////////////////////////////
    // Retrieval
    ///////////////////////////////////////////////////////

    getElementViaKey(key: number): T {
        assertTrue(this._keyToElement.has(key), `No element found at ${key}.`);
        return this._keyToElement.get(key)!;
    }

    getElementViaPoint(point: Point): T {
        assertTrue(this._keyToElement.has(point.key), `No element found at ${point.key}.`);
        return this._keyToElement.get(point.key)!;
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

    moveElement(element: T, destCoord: Point) {
        assertTrue(this._elementToPoint.has(element),);
        assertTrue(this._keyToElement.has(destCoord.key) === false, `Can't move element to ${destCoord.key} as there is already an element at the destination.`);
        this.removeViaElement(element);
        this.set(destCoord, element);
    }

    ///////////////////////////////////////////////////////
    // Iterators & Generators
    ///////////////////////////////////////////////////////

    iterateElements() {
        return [...this._elementToPoint];
    }

    * iterateSurrounding(point: Point): Generator<[Point, T | undefined]> {
        for (let c of point.iterateNeighbors()) {
            const e = this._keyToElement.get(c.key);
            yield [c, e];
        }
    }

    * iterateCircle(center: Point, radius: number): Generator<[Point, T | undefined]> {
        for (let c of GMath.iteratePointWithinCircle(center, radius))
            yield [c, this._keyToElement.get(c.key)];
    }

    * iterateCircumference(center: Point, radius: number): Generator<[Point, T | undefined]> {
        for (let c of GMath.PointOnCircumferenceSet(center, radius))
            yield [c, this._keyToElement.get(c.key)];
    }




}


