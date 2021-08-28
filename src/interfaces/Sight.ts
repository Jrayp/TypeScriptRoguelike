import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import Positional from "./Positional";



export default interface Sight extends Positional {

    fov: PreciseShadowcasting;
    sightRange: number;

    currentlySeenCoordKeys : Set<string>;


    computeFov() :  Set<string>;

}


// static computeFov() {
//     const actorCoords = this.getCoords()!;
//     this.currentlySeenCoordKeys.clear();

//     this._fov.compute(actorCoords.x, actorCoords.y, this.sightRange, this.fovCallback);

//     return this.currentlySeenCoordKeys;
// }

// private fovCallback = (x: number, y: number, r: number, visibility: number) => {
//     this.currentlySeenCoordKeys.add(Coords.makeKey(x, y));
// }

// private lightPasssesCallback(x: number, y: number) {
//     if (!G.board.numbersWithinBounds(x, y))
//         return false;
//     else
//         return G.board.tileLayer.getElementViaKey(Coords.makeKey(x, y)).transparent;
// }