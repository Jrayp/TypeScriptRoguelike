import Cell from "../util/Cell";

export default interface IPositional {
    get position(): Cell | undefined;
}