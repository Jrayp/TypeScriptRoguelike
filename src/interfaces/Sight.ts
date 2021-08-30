import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import Positional from "./Positional";

export default interface Sight extends Positional {

    fovAlgo: PreciseShadowcasting;
    sightRange: number;
    seenCoords: Set<string>;

    computeFov(): Set<string>;

}
