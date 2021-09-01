import Coords from "../util/Coords";

export default interface IPositional {

    get coords(): Coords | undefined;
}