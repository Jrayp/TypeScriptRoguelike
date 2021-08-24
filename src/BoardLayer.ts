import { AssertionError } from "assert/strict";
import { assert } from "console";
import Coords from "./util/Coords";

export default class BoardLayer<T> {

    private _elementToCoords: Map<T, Coords> = new Map();
    private _keyToElement: Map<string, T> = new Map();

    clear() {
        this._elementToCoords.clear();
        this._keyToElement.clear();
    }

    set(coords: Coords, element: T) {
        this.assert(this._keyToElement.has(coords.key) === false);
        this.assert(this._elementToCoords.has(element) === false);
        this._keyToElement.set(coords.key, element);
        this._elementToCoords.set(element, coords);
    }

    replace(coords: Coords, element: T) {
        this.removeViaCoords(coords);
        this.set(coords, element);
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

    getElementViaKey(key: string): T {
        this.assert(this._keyToElement.has(key), `No element found at ${key}.`);
        return this._keyToElement.get(key)!;
    }

    getElementViaCoords(coords: Coords): T {
        this.assert(this._keyToElement.has(coords.key), `No element found at ${coords.key}.`);
        return this._keyToElement.get(coords.key)!;
    }

    getCoordsViaElement(element: T): Coords {
        this.assert(this._elementToCoords.has(element), `No Coords found for ${element}.`);
        return this._elementToCoords.get(element)!;
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

    moveViaElement(element: T, destCoord: Coords) {
        this.assert(this._elementToCoords.has(element));
        this.assert(this._keyToElement.has(destCoord.key) === false);
        this.removeViaElement(element);
        this.set(destCoord, element);
    }

    moveViaCoords(currentCoord: Coords, destCoord: Coords) {
        this.assert(this._keyToElement.has(currentCoord.key));
        this.assert(this._keyToElement.has(destCoord.key) === false);
        let element = this._keyToElement.get(currentCoord.key)!;
        this.removeViaCoords(currentCoord);
        this.set(destCoord, element);
    }

    private assert(condition: any, msg?: string): asserts condition {
        if (!condition) {
            throw new Error(msg);
        }
    }

    iterator() {
        return [...this._elementToCoords];
    }
}


