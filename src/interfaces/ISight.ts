import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import Point from "./../util/Point";
import IPositional from "./IPositional";

export default interface ISight extends IPositional {

    fovAlgo: PreciseShadowcasting;

    seenPoints: Set<Point>;

    computeFov(): Set<Point>;
    get sightRange(): number;

}
