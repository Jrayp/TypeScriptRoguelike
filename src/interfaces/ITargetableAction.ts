import _Action from "../actions/_Action";
import Coords from "../util/Coords";

export default interface ITargetableAction extends _Action {


    target(start: Coords, end: Coords): void;


}