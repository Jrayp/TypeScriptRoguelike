import Coords from "./../util/Coords";

export default interface Positional {

    get coords(): Coords | undefined;
}