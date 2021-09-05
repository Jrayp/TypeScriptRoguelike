import Point from "../util/Point";

export default interface IPositional {

    get position(): Point | undefined;
}