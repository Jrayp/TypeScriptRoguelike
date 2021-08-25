import C from "./C";
import { assertTrue } from "./util/Assertions";
import Coords from "./util/Coords";

export default class BoardLayer<T> {
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

    getCoordsViaElement(element: T): Coords {
        assertTrue(this._elementToCoords.has(element), `No Coords found for ${element}.`);
        return this._elementToCoords.get(element)!;
    }


    ///////////////////////////////////////////////////////
    // Altering
    ///////////////////////////////////////////////////////

    replace(coords: Coords, element: T) {
        this.removeViaCoords(coords);
        this.set(coords, element);
    }

    moveViaElement(element: T, destCoord: Coords) {
        assertTrue(this._elementToCoords.has(element),);
        assertTrue(this._keyToElement.has(destCoord.key) === false, `Can't move element to ${destCoord.key} as there is already an element at the destination.`);
        this.removeViaElement(element);
        this.set(destCoord, element);
    }

    moveViaCoords(currentCoord: Coords, destCoord: Coords) {
        assertTrue(this._keyToElement.has(currentCoord.key));
        assertTrue(this._keyToElement.has(destCoord.key) === false), `Can't move element to ${destCoord.key} as there is already an element at the destination.`;
        let element = this._keyToElement.get(currentCoord.key)!;
        this.removeViaCoords(currentCoord);
        this.set(destCoord, element);
    }


    ///////////////////////////////////////////////////////
    // Collestions
    ///////////////////////////////////////////////////////

    getSurroundingElementsSet(coords: Coords) {
        let surroundingElementSet = new Set<T>();
        for (let d of C.DIR_COORDS) {
            const c = Coords.addCoordsToCoords(coords, d);
            if (this._keyToElement.has(c.key))
                surroundingElementSet.add(this._keyToElement.get(c.key)!);
        }
        return surroundingElementSet;
    }

    getSurroundingElementsList(coords: Coords) {
        let surroundingElementList: T[] = [];
        for (let d of C.DIR_COORDS) {
            const c = Coords.addCoordsToCoords(coords, d);
            if (this._keyToElement.has(c.key))
                surroundingElementList.push(this._keyToElement.get(c.key)!);
        }
        return surroundingElementList;
    }

    ///////////////////////////////////////////////////////
    // Iterators
    ///////////////////////////////////////////////////////

    * iterateSurroundingElements(coords: Coords) {
        for (let d of C.DIR_COORDS) {
            const c = Coords.addCoordsToCoords(coords, d);
            if (this._keyToElement.has(c.key))
                yield this._keyToElement.get(c.key)!;
        }
    }

    iterateElements() {
        return [...this._elementToCoords];
    }
}


