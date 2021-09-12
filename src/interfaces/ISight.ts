import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import Point from "./../util/Point";
import IPositional from "./IPositional";

export default interface ISight extends IPositional {
    computeFov(): Set<Point>;
    get sightRange(): number;
    get seenPoints(): Set<Point>;
}
