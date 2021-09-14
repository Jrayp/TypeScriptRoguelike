import _Action from "../actions/_Action";
import Cell from "../util/Cell";

export default interface ITargetableAction extends _Action {
    target(start: Cell, end: Cell): void;
}