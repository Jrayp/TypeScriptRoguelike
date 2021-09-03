import { Icon } from "./../controllers/UIController";
import G from "./../G";
import ITargetable from "../interfaces/ITargetable";
import Coords from "./../util/Coords";
import GMath from "./../util/GMath";
import _Action from "./_Action";
import { ActionState } from "./../Enums";
import FireballEffect from "./../effects/FireBallEffect";

export default class FireballAction extends _Action implements ITargetable {

    radius = 2.45;

    path: Coords[];

    setTargetingIcons(start: Coords, end: Coords) {
        let circleIcon = new Icon(' ', null, [0, 255, 0]);
        let lineIcon = new Icon('*', [255, 255, 255], null);
        let combinedIcon = new Icon('*', [255, 255, 255], [0, 255, 0]);

        this.path = GMath.line(start, end);
        this.path.shift();

        let circle = GMath.coordsWithinCircleMap(end, this.radius);
        for (let kAndC of circle) {
            G.board.icons.addIcon(kAndC[1], circleIcon);
        }
        for (let c of this.path) {
            if (circle.has(c.key))
                G.board.icons.addIcon(c, combinedIcon);
            else
                G.board.icons.addIcon(c, lineIcon);
        }
    }

    perform() {
        G.board.effects.set(this.path[0], new FireballEffect(this.path));
        G.board.effects.handleEffects();
        return ActionState.SUCCESSFUL;
    }


}