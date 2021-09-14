import { Icon } from "./../controllers/UIController";
import G from "./../G";
import ITargetableAction from "../interfaces/ITargetableAction";
import Point from "../util/Point";
import GMath from "./../util/GMath";
import _Action from "./_Action";
import { ActionState } from "./../Enums";
import FireballEffect from "./../effects/FireBallEffect";

export default class FireballAction extends _Action implements ITargetableAction {

    radius = 2.45;

    path: Point[];

    target(start: Point, end: Point) {
        let aoeIcon = new Icon(' ', null, [0, 150, 30]);
        let lineIcon = new Icon('*', [255, 255, 255], null);
        let combinedIcon = new Icon('*', [255, 255, 255], [0, 150, 30]);
        let Unseen = new Icon('?', [200, 200, 175], null);
        let UnseenAndAoe = new Icon('?', [200, 200, 175], [0, 150, 30]);

        this.path = GMath.lineList(start, end, 1);

        let circle = GMath.pointWithinCircleSet(end, this.radius);
        for (let p of circle) {
            {
                if (!G.board.tiles.hasPoint(p))
                    continue;
                let tile = G.board.tiles.getElementViaPoint(p);
                if (tile.occupant() && G.player.seenPoints.has(p))
                    G.board.icons.addIcon(p, new Icon(tile.occupant()!.glyph, tile.occupant()!.fgColor, [255, 50, 30]));
                else if (G.player.seenPoints.has(p))
                    G.board.icons.addIcon(p, aoeIcon);
                else
                    G.board.icons.addIcon(p, new Icon(' ', null, [0, 100, 25]));
            }
        }
        for (let p of this.path) {
            let tile = G.board.tiles.getElementViaPoint(p);
            switch (G.player.seenPoints.has(p)) {
                case true:
                    if (tile.occupant())
                        G.board.icons.addIcon(p, new Icon(tile.occupant()!.glyph, tile.occupant()!.fgColor, [255, 50, 30]));
                    else if (circle.has(p))
                        G.board.icons.addIcon(p, combinedIcon);
                    else
                        G.board.icons.addIcon(p, lineIcon);
                    break;

                case false:
                    if (circle.has(p))
                        G.board.icons.addIcon(p, new Icon('?', null, [0, 100, 25]));
                    else
                        G.board.icons.addIcon(p, Unseen);
                    break;
            }


        }
    }

    perform() {
        G.board.effects.set(this.path[0] ?? G.player.position, new FireballEffect(this.path));
        return ActionState.START_EFFECT;
    }


}