import _Action from "../actions/_Action";
import Point from "../util/Point";

export default interface ITargetableAction extends _Action {


    target(start: Point, end: Point): void;


}