import { assert } from "console";

export default class Layer<T> {

    elementToPosition: Map<T, number> = new Map();
    positionToElement: Map<number, T> = new Map();

    set(position: number, element: T) {
        assert(this.positionToElement.has(position) === false);
        assert(this.elementToPosition.has(element) === false);

        this.positionToElement.set(position, element);
        this.elementToPosition.set(element, position);
    }

    hasElement(element: T) {
        return this.elementToPosition.has(element);
    }

    hasPosition(position: number) {
        return this.positionToElement.has(position);
    }

    getElementViaPosition(position: number): T {
        assert(this.positionToElement.has(position));
        return this.positionToElement.get(position)!;
    }

    getPositionViaElement(element: T): number {
        assert(this.elementToPosition.has(element));
        return this.elementToPosition.get(element)!;
    }

    removeViaElement(element: T) {
        assert(this.elementToPosition.has(element));

        let position = this.elementToPosition.get(element);
        this.elementToPosition.delete(element);
        this.positionToElement.delete(position!);
    }

    removeViaPosition(position: number) {
        assert(this.positionToElement.has(position));

        let element = this.positionToElement.get(position);
        this.positionToElement.delete(position);
        this.elementToPosition.delete(element!);
    }

    moveViaPosition(currentPosition: number, newPosition: number) {
        assert(this.positionToElement.has(currentPosition));
        assert(this.positionToElement.has(newPosition) === false);
        let element = this.getElementViaPosition(newPosition);
        this.removeViaPosition(currentPosition);
        this.set(newPosition, element!);
    }

    moveViaElement(element: T, newPosition: number) {
        assert(this.elementToPosition.has(element));
        assert(this.positionToElement.has(newPosition) === false);
        this.removeViaElement(element);
        this.set(newPosition, element!);
    }

    iterator() {
        return [...this.elementToPosition];
    }
}


