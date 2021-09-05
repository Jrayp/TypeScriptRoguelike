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

        this.path = GMath.lineList(start, end);
        this.path.shift();

        let circle = GMath.PointWithinCircleMap(end, this.radius);
        for (let kAndC of circle) {
            {
                if (!G.board.tiles.hasKey(kAndC[0]))
                    continue;
                let tile = G.board.tiles.getElementViaKey(kAndC[0]);
                if (tile.occupant && G.player.seenPoint.has(kAndC[0]))
                    G.board.icons.addIcon(kAndC[1], new Icon(tile.occupant.glyph, tile.occupant.fgColor, [255, 50, 30]));
                else if (G.player.seenPoint.has(kAndC[0]))
                    G.board.icons.addIcon(kAndC[1], aoeIcon);
                else
                    G.board.icons.addIcon(kAndC[1], new Icon(' ', null, [0, 100, 25]));
            }
        }
        for (let c of this.path) {
            let tile = G.board.tiles.getElementViaPoint(c);
            switch (G.player.seenPoint.has(c.key)) {
                case true:
                    if (tile.occupant)
                        G.board.icons.addIcon(c, new Icon(tile.occupant.glyph, tile.occupant.fgColor, [255, 50, 30]));
                    else if (circle.has(c.key))
                        G.board.icons.addIcon(c, combinedIcon);
                    else
                        G.board.icons.addIcon(c, lineIcon);
                    break;

                case false:
                    if (circle.has(c.key))
                        G.board.icons.addIcon(c, new Icon('?', null, [0, 100, 25]));
                    else
                        G.board.icons.addIcon(c, Unseen);
                    break;
            }


        }
    }

    perform() {
        G.board.effects.set(this.path[0], new FireballEffect(this.path));
        return ActionState.START_EFFECT;
    }


}