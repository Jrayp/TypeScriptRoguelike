import { assertTrue } from "./Assertions";
import GMath from "./GMath";
import Cell from "./Cell";

export default class CellElementBiMap<T>{
    protected _elementToCell: Map<T, Cell> = new Map();
    protected _cellToElement: Map<Cell, T> = new Map();

    get count() {
        return this._elementToCell.size;
    }

    ///////////////////////////////////////////////////////
    // Setting and removal
    ///////////////////////////////////////////////////////

    set(cell: Cell, element: T) {
        assertTrue(this._cellToElement.has(cell) === false);
        assertTrue(this._elementToCell.has(element) === false);
        this._cellToElement.set(cell, element);
        this._elementToCell.set(element, cell);
    }

    removeViaElement(element: T) {
        assertTrue(this._elementToCell.has(element))
        const cell = this._elementToCell.get(element)!;
        this._elementToCell.delete(element);
        this._cellToElement.delete(cell);
    }

    removeViaCell(cell: Cell) {
        assertTrue(this._cellToElement.has(cell));
        let element = this._cellToElement.get(cell)!;
        this._cellToElement.delete(cell);
        this._elementToCell.delete(element);
    }

    clear() {
        this._elementToCell.clear();
        this._cellToElement.clear();
    }


    ///////////////////////////////////////////////////////
    // Existance
    ///////////////////////////////////////////////////////

    hasElement(element: T) {
        return this._elementToCell.has(element);
    }

    hasCell(cell: Cell) {
        return this._cellToElement.has(cell);
    }

    hasXYZ(x: number, y: number, z: number) {
        return this._cellToElement.has(Cell.get(x, y, z)!);
    }

    ///////////////////////////////////////////////////////
    // Retrieval
    ///////////////////////////////////////////////////////

    getElementViaCell(cell: Cell): T {
        assertTrue(this._cellToElement.has(cell));
        return this._cellToElement.get(cell)!;
    }

    getElementViaXYZ(x: number, y: number, z: number): T {
        const cell = Cell.get(x, y, z)!;
        assertTrue(this._cellToElement.has(cell));
        return this._cellToElement.get(cell)!;
    }

    getCellViaElement(element: T): Cell | undefined {
        return this._elementToCell.get(element);
    }

    ///////////////////////////////////////////////////////
    // Altering
    ///////////////////////////////////////////////////////

    replace(cell: Cell, element: T) {
        this.removeViaCell(cell);
        this.set(cell, element);
    }

    moveElementToCell(element: T, destCell: Cell) {
        assertTrue(this._elementToCell.has(element),);
        assertTrue(this._cellToElement.has(destCell) === false);
        this.removeViaElement(element);
        this.set(destCell, element);
    }

    ///////////////////////////////////////////////////////
    // Iterators & Generators
    ///////////////////////////////////////////////////////

    iterateElements() {
        return [...this._elementToCell];
    }

    * iterateSurroundingPlane(center: Cell): Generator<[Cell, T | undefined]> {
        for (let p of center.iterateNeighbors()) {
            const e = this._cellToElement.get(p);
            yield [p, e];
        }
    }

    * iterateCircle(center: Cell, radius: number): Generator<[Cell, T | undefined]> {
        for (let p of GMath.iterateCellsWithinCircle(center, radius))
            yield [p, this._cellToElement.get(p)];
    }

    * iterateCircumference(center: Cell, radius: number): Generator<[Cell, T | undefined]> {
        for (let p of GMath.iterateCellsOnCircumference(center, radius))
            yield [p, this._cellToElement.get(p)];
    }
}


