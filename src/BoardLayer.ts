import { assert } from "console";
import Coords from "./util/Coords";

export default class BoardLayer<T> {

    elementToCoords: Map<T, Coords> = new Map();
    keyToElement: Map<string, T> = new Map();

    set(coords: Coords, element: T) {
        assert(this.keyToElement.has(coords.key) === false);
        assert(this.elementToCoords.has(element) === false);
        this.keyToElement.set(coords.key, element);
        this.elementToCoords.set(element, coords);
    }

    replace(coords: Coords, element: T) {
        this.removeViaCoords(coords);
        this.set(coords, element);
    }

    hasKey(key: string) {
        return this.keyToElement.has(key);
    }

    hasElement(element: T) {
        return this.elementToCoords.has(element);
    }

    hasCoords(coords: Coords) {
        return this.keyToElement.has(coords.key);
    }

    getElementViaKey(key: string): T {
        assert(this.keyToElement.has(key), `No element at ${key}`);
        return this.keyToElement.get(key)!;
    }


    getElementViaCoords(coords: Coords): T {
        assert(this.keyToElement.has(coords.key), `No element at ${coords.key}`);
        return this.keyToElement.get(coords.key)!;
    }

    getCoordsViaElement(element: T) {
        assert(this.elementToCoords.has(element));
        return this.elementToCoords.get(element)!;
    }

    removeViaKey(key: string) {
        let element = this.keyToElement.get(key)!;
        this.keyToElement.delete(key);
        this.elementToCoords.delete(element);
    }

    removeViaElement(element: T) {
        const coords = this.elementToCoords.get(element)!;
        this.elementToCoords.delete(element);
        this.keyToElement.delete(coords.key);
    }

    removeViaCoords(coords: Coords) {
        let element = this.keyToElement.get(coords.key)!;
        this.keyToElement.delete(coords.key);
        this.elementToCoords.delete(element);
    }

    moveViaElement(element: T, destCoord: Coords) {
        assert(this.elementToCoords.has(element));
        assert(this.keyToElement.has(destCoord.key) === false);
        this.removeViaElement(element)!;
        this.set(destCoord, element);
    }

    moveViaCoords(currentCoord: Coords, destCoord: Coords) {
        assert(this.keyToElement.has(currentCoord.key));
        assert(this.keyToElement.has(destCoord.key) === false);
        let element = this.keyToElement.get(currentCoord.key)!;
        this.removeViaCoords(currentCoord);
        this.set(destCoord, element);
    }

    iterator() {
        return [...this.elementToCoords];
    }
}


