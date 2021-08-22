import { assert } from "console";

export default class BoardLayer<T> {

    elementToCoord: Map<T, [number, number, string]> = new Map();
    coordToElement: Map<string, T> = new Map();

    set(coord: [number, number, string], element: T) {
        assert(this.coordToElement.has(coord[2]) === false);
        assert(this.elementToCoord.has(element) === false);
        this.coordToElement.set(coord[2], element);
        this.elementToCoord.set(element, coord);
    }

    hasElement(element: T) {
        return this.elementToCoord.has(element);
    }

    hasPosition(coord: [number, number, string]) {
        return this.coordToElement.has(coord[2]);
    }

    getElementViaCoord(coord: [number, number, string]): T {
        assert(this.coordToElement.has(coord[2]));
        return this.coordToElement.get(coord[2])!;
    }

    getCoordViaElement(element: T) {
        assert(this.elementToCoord.has(element));
        return this.elementToCoord.get(element)!;
    }

    removeViaElement(element: T) {
        assert(this.elementToCoord.has(element));
        const coord = this.elementToCoord.get(element)!;
        this.elementToCoord.delete(element);
        this.coordToElement.delete(coord[2]);
    }

    removeViaCoord(coord: [number, number, string]) {
        assert(this.coordToElement.has(coord[2]));
        let element = this.coordToElement.get(coord[2])!;
        this.coordToElement.delete(coord[2]);
        this.elementToCoord.delete(element);
    }

    moveViaCoord(currentCoord: [number, number, string], destCoord: [number, number, string]) {
        assert(this.coordToElement.has(currentCoord[2]));
        assert(this.coordToElement.has(destCoord[2]) === false);
        let element = this.coordToElement.get(currentCoord[2])!;
        this.removeViaCoord(currentCoord);
        this.set(destCoord, element);
    }

    moveViaElement(element: T, destCoord: [number, number, string]) {
        assert(this.elementToCoord.has(element));
        assert(this.coordToElement.has(destCoord[2]) === false);
        this.removeViaElement(element)!;
        this.set(destCoord, element);
    }

    iterator() {
        return [...this.elementToCoord];
    }
}


