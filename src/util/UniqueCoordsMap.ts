import { Direction } from "./../Enums";
import { assertTrue } from "./Assertions";
import Coords from "./Coords";
import GMath from "./GMath";

export default class UniqueCoordsMap<T>{
    protected _elementToCoords: Map<T, Coords> = new Map();
    protected _keyToElement: Map<number, T> = new Map();


    get count() {
        return this._keyToElement.size;
    }

    ///////////////////////////////////////////////////////
    // Setting and removal
    ///////////////////////////////////////////////////////

    set(coords: Coords, element: T) {
        assertTrue(Number.isInteger(coords.x) && Number.isInteger(coords.y), `x and y must be Integers. Passed: (${coords.key})`);
        assertTrue(this._keyToElement.has(coords.key) === false, `There is already an element at ${coords.key}`);
        assertTrue(this._elementToCoords.has(element) === false, `There are already Coords at ${this._elementToCoords.get(element)}`);
        this._keyToElement.set(coords.key, element);
        this._elementToCoords.set(element, coords);
    }

    removeViaKey(key: number) {
        let element = this._keyToElement.get(key)!;
        this._keyToElement.delete(key);
        this._elementToCoords.delete(element);
    }

    removeViaElement(element: T) {
        const coords = this._elementToCoords.get(element)!;
        this._elementToCoords.delete(element);
        this._keyToElement.delete(coords.key);
    }

    removeViaCoords(coords: Coords) {
        let element = this._keyToElement.get(coords.key)!;
        this._keyToElement.delete(coords.key);
        this._elementToCoords.delete(element);
    }

    clear() {
        this._elementToCoords.clear();
        this._keyToElement.clear();
    }


    ///////////////////////////////////////////////////////
    // Existance
    ///////////////////////////////////////////////////////

    hasKey(key: number) {
        return this._keyToElement.has(key);
    }

    hasElement(element: T) {
        return this._elementToCoords.has(element);
    }

    hasCoords(coords: Coords) {
        return this._keyToElement.has(coords.key);
    }

    ///////////////////////////////////////////////////////
    // Retrieval
    ///////////////////////////////////////////////////////

    getElementViaKey(key: number): T {
        assertTrue(this._keyToElement.has(key), `No element found at ${key}.`);
        return this._keyToElement.get(key)!;
    }

    getElementViaCoords(coords: Coords): T {
        assertTrue(this._keyToElement.has(coords.key), `No element found at ${coords.key}.`);
        return this._keyToElement.get(coords.key)!;
    }

    getCoordsViaElement(element: T): Coords | undefined {
        // assertTrue(this._elementToCoords.has(element), `No Coords found for ${element}.`);
        return this._elementToCoords.get(element);
    }


    ///////////////////////////////////////////////////////
    // Altering
    ///////////////////////////////////////////////////////

    replace(coords: Coords, element: T) {
        this.removeViaCoords(coords);
        this.set(coords, element);
    }

    moveElement(element: T, destCoord: Coords) {
        assertTrue(this._elementToCoords.has(element),);
        assertTrue(this._keyToElement.has(destCoord.key) === false, `Can't move element to ${destCoord.key} as there is already an element at the destination.`);
        this.removeViaElement(element);
        this.set(destCoord, element);
    }

    ///////////////////////////////////////////////////////
    // Iterators & Generators
    ///////////////////////////////////////////////////////

    iterateElements() {
        return [...this._elementToCoords];
    }

    * iterateSurrounding(coords: Coords): Generator<[Coords, T | undefined]> {
        for (let c of coords.iterateNeighbors()) {
            const e = this._keyToElement.get(c.key);
            yield [c, e];
        }
    }

    * iterateCircle(center: Coords, radius: number): Generator<[Coords, T | undefined]> {
        for (let c of GMath.iterateCoordsWithinCircle(center, radius))
            yield [c, this._keyToElement.get(c.key)];
    }

    * iterateCircumference(center: Coords, radius: number): Generator<[Coords, T | undefined]> {
        for (let c of GMath.coordsOnCircumferenceSet(center, radius))
            yield [c, this._keyToElement.get(c.key)];
    }




}


