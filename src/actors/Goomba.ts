import { Color as ColorHelper, RNG } from "rot-js";
import _Action from "./../actions/_Action";
import MoveAction from "./../actions/MoveAction";
import G from "./../G";
import Point from "../util/Point";
import _Npc from "./_Npc";
import AttackAction from "./../actions/AttackAction";

export default class Goomba extends _Npc {
    name = "Goomba";
    _glyph = 'g';
    _fgColor = ColorHelper.fromString("orange");
    _bgColor = null;

    alive = true;

    constructor() {
        super();
    }

    // Make this return actions (like player) and perform them via the npcController
    act() {
        let action: _Action | undefined;

        let freePoint: Point[] = [];
        let generator = G.board.tiles.iterateSurroundingPlane(this.position!);
        for (let pointAndTile of generator) {
            const tile = pointAndTile[1]!;
            if (tile.occupant() == G.player) {
                action = new AttackAction(tile.occupant()!);
                break;
            }
            else if (tile.passable && !tile.occupant)
                freePoint.push(pointAndTile[0]);
        }

        if (!action) {
            let selection = RNG.getItem(freePoint);
            if (selection)
                action = new MoveAction(this, selection);
        }

        if (action)
            action.perform();
    }

    kill() {
        G.board.actors.removeViaElement(this);
    }

}

