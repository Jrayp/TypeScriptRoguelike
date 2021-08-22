import { assert } from "console";
import Coords from "./util/Coords";

export default class BoardLayer<T> {

    elementToCoords: Map<T, Coords> = new Map();
    coordsToElement: Map<string, T> = new Map();

    set(coords: Coords, element: T) {
        assert(this.coordsToElement.has(coords.key) === false);
        assert(this.elementToCoords.has(element) === false);
        this.coordsToElement.set(coords.key, element);
        this.elementToCoords.set(element, coords);
    }

    replace(coords: Coords, element: T) {
        this.removeViaCoords(coords);
        this.set(coords, element);
    }

    hasElement(element: T) {
        return this.elementToCoords.has(element);
    }

    hasCoords(coords: Coords) {
        return this.coordsToElement.has(coords.key);
    }

    getElementViaCoords(coords: Coords): T {
        assert(this.coordsToElement.has(coords.key));
        return this.coordsToElement.get(coords.key)!;
    }

    getCoordsViaElement(element: T) {
        assert(this.elementToCoords.has(element));
        return this.elementToCoords.get(element)!;
    }

    removeViaElement(element: T) {
        const coords = this.elementToCoords.get(element)!;
        this.elementToCoords.delete(element);
        this.coordsToElement.delete(coords.key);
    }

    removeViaCoords(coords: Coords) {
        let element = this.coordsToElement.get(coords.key)!;
        this.coordsToElement.delete(coords.key);
        this.elementToCoords.delete(element);
    }

    moveViaElement(element: T, destCoord: Coords) {
        assert(this.elementToCoords.has(element));
        assert(this.coordsToElement.has(destCoord.key) === false);
        this.removeViaElement(element)!;
        this.set(destCoord, element);
    }

    moveViaCoords(currentCoord: Coords, destCoord: Coords) {
        assert(this.coordsToElement.has(currentCoord.key));
        assert(this.coordsToElement.has(destCoord.key) === false);
        let element = this.coordsToElement.get(currentCoord.key)!;
        this.removeViaCoords(currentCoord);
        this.set(destCoord, element);
    }

    iterator() {
        return [...this.elementToCoords];
    }
}


