import { Icon } from "./../controllers/UIController";
import G from "./../G";
import ITargetable from "../interfaces/ITargetable";
import Coords from "./../util/Coords";
import GMath from "./../util/GMath";
import _Action from "./_Action";

export default class FireballAction extends _Action implements ITargetable {

    radius = 2.45;

    setTargetingIcons(start: Coords, end: Coords) {
        let line = GMath.line(start, end);
        for (let c of line) {
            console.log(c.key);

            G.board.icons.addIcon(c, Icon.TARGET_ICON);
        }
        for (let c of GMath.iterateCoordsWithinCircle(end, this.radius)) {
            G.board.icons.addIcon(c, Icon.TARGET_ICON);
        }
    }


}