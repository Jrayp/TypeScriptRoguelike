import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import IPositional from "./IPositional";

export default interface ISight extends IPositional {

    fovAlgo: PreciseShadowcasting;

    seenPoints: Set<number>;

    computeFov(): Set<number>;
    get sightRange(): number;

}
