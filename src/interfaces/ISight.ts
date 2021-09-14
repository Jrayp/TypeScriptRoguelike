import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import Cell from "../util/Cell";
import IPositional from "./IPositional";

export default interface ISight extends IPositional {
    computeFov(): Set<Cell>;
    get sightRange(): number;
    get seenCells(): Set<Cell>;
}
