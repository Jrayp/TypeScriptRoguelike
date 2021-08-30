import { assertTrue } from "./Assertions";
import Coords from "./Coords";
import GMath from "./GMath";

export default class UniqueCoordsMap<T> {
    private _elementToCoords: Map<T, Coords> = new Map();
    private _keyToElement: Map<string, T> = new Map();


    ///////////////////////////////////////////////////////
    // Setting and removal
    ///////////////////////////////////////////////////////

    set(coords: Coords, element: T) {
        assertTrue(this._keyToElement.has(coords.key) === false);
        assertTrue(this._elementToCoords.has(element) === false);
        this._keyToElement.set(coords.key, element);
        this._elementToCoords.set(element, coords);
    }

    removeViaKey(key: string) {
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

    count() {
        return this._keyToElement.size;
    }

    hasKey(key: string) {
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

    getElementViaKey(key: string): T {
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
        for (let d of GMath.DIR_COORDS) {
            const c = Coords.addCoordsToCoords(coords, d);
            const e = this._keyToElement.get(c.key);
            yield [c, e];
        }
    }

    // TODO: Find clean way of returning radius of tile. maybe in squared form so we only 
    // squareroot when needed
    * iterateCircle(center: Coords, radius: number): Generator<[Coords, T | undefined]> {
        let top = Math.floor(center.y - radius);
        let bottom = Math.ceil(center.y + radius);
        let left = Math.floor(center.x - radius);
        let right = Math.ceil(center.x + radius);

        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (GMath.insideCircle(center, x, y, radius)) {
                    const c = new Coords(x, y);
                    const e = this._keyToElement.get(c.key);
                    yield [c, e]
                }
            }
        }
    }




}


