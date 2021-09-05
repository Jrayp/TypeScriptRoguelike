import { Color as ColorHelper, RNG } from "rot-js";
import _Action from "./../actions/_Action";
import MoveAction from "./../actions/MoveAction";
import G from "./../G";
import Coords from "../util/Coords";
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

        let freeCoords: Coords[] = [];
        let generator = G.board.tiles.iterateSurrounding(this.coords!);
        for (let coordsAndTile of generator) {
            const tile = coordsAndTile[1]!;
            if (tile.occupant == G.player) {
                action = new AttackAction(tile.occupant!);
                break;
            }
            else if (tile.passable && !tile.occupant)
                freeCoords.push(coordsAndTile[0]);
        }

        if (!action) {
            let selection = RNG.getItem(freeCoords);
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

