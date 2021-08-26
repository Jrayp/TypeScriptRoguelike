import { ALL } from "dns";
import { _BoardTile } from "./boardTiles/_BoardTile";
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

    // moveViaCoords(currentCoord: Coords, destCoord: Coords) {
    //     assertTrue(this._keyToElement.has(currentCoord.key));
    //     assertTrue(this._keyToElement.has(destCoord.key) === false), `Can't move element to ${destCoord.key} as there is already an element at the destination.`;
    //     let element = this._keyToElement.get(currentCoord.key)!;
    //     this.removeViaCoords(currentCoord);
    //     this.set(destCoord, element);
    // }


    ///////////////////////////////////////////////////////
    // Collections
    ///////////////////////////////////////////////////////

    // getSurroundingElementsSet(coords: Coords, includeUndefined: boolean): Set<T | undefined> {
    //     let surroundingElementSet = new Set<T | undefined>();
    //     for (let d of C.DIR_COORDS) {
    //         const c = Coords.addCoordsToCoords(coords, d);
    //         if (includeUndefined || this._keyToElement.has(c.key))
    //             surroundingElementSet.add(this._keyToElement.get(c.key));
    //     }
    //     return surroundingElementSet;
    // }

    // getSurroundingElementsList(coords: Coords, includeUndefined: boolean): (T | undefined)[] {
    //     let surroundingElementList: (T | undefined)[] = [];
    //     for (let d of C.DIR_COORDS) {
    //         const c = Coords.addCoordsToCoords(coords, d);

    //         if (includeUndefined || this._keyToElement.has(c.key))
    //             surroundingElementList.push(this._keyToElement.get(c.key));
    //     }
    //     return surroundingElementList;
    // }

    // getSurroundingElementsListCond(coords: Coords, cond: (element: T | undefined) => boolean): (T | undefined)[] {
    //     let surroundingElementList: (T | undefined)[] = [];
    //     for (let d of C.DIR_COORDS) {
    //         const c = Coords.addCoordsToCoords(coords, d);
    //         const e = this._keyToElement.get(c.key);
    //         if (cond(e))
    //             surroundingElementList.push(this._keyToElement.get(c.key));
    //     }
    //     return surroundingElementList;
    // }

    ///////////////////////////////////////////////////////
    // Iterators
    ///////////////////////////////////////////////////////

    // * iterateSurrounding(coords: Coords, condition: ((coords: Coords, element: T | undefined) => boolean) | undefined = undefined): Generator<[Coords, T | undefined]> {
    //     for (let d of C.DIR_COORDS) {
    //         const c = Coords.addCoordsToCoords(coords, d);
    //         const e = this._keyToElement.get(c.key);
    //         if (condition == undefined || condition(c, e))
    //             yield [c, e];
    //     }
    // }

    * iterateSurrounding(coords: Coords): Generator<[Coords, T | undefined]> {
        for (let d of C.DIR_COORDS) {
            const c = Coords.addCoordsToCoords(coords, d);
            const e = this._keyToElement.get(c.key);
            yield [c, e];
        }
    }


    iterateElements() {
        return [...this._elementToCoords];
    }


    ///////////////////////////////////////////////////////
    // Common Conditionals
    ///////////////////////////////////////////////////////

    // static openTileCondition(c: Coords, t: _BoardTile) {
    //     return t.passable && t.occupant() == false;
    // }

}


