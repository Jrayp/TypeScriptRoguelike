import { Color as ColorHelper, RNG } from "rot-js";
import _Action from "./../actions/_Action";
import MoveAction from "./../actions/MoveAction";
import G from "./../G";
import Cell from "../util/Cell";
import _Npc from "./_Npc";
import AttackAction from "./../actions/AttackAction";
import Light from "./../lights/Light";

export default class AnglerFish extends _Npc {
    name = "Angler Fish";
    _glyph = 'f';
    _fgColor = ColorHelper.fromString("blue");
    _bgColor = null;

    alive = true;

    light: Light;

    constructor() {
        super();

        this.light = new Light(this, 3, [240, 50, 180]);
        G.board.lights.addLight(this.light);

    }

    // Make this return actions (like player) and perform them via the npcController
    act() {
        let action: _Action | undefined;

        let freeCell: Cell[] = [];
        let generator = G.board.tiles.iterateSurroundingPlane(this.position!);
        for (let cellAndTile of generator) {
            const tile = cellAndTile[1]!;
            if (tile.occupant() == G.player) {
                action = new AttackAction(tile.occupant()!);
                break;
            }
            else if (tile.passable && !tile.occupant())
                freeCell.push(cellAndTile[0]);
        }

        if (!action) {
            let selection = RNG.getItem(freeCell);
            if (selection)
                action = new MoveAction(this, selection);
        }

        if (action)
            action.perform();
    }

    kill() {
        G.board.lights.removeLight(this.light);
        G.board.actors.removeViaElement(this);
    }

}

