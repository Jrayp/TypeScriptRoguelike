import { Color as ColorHelper, RNG } from "rot-js";
import BoardLayer from "./../BoardLayer";
import { _BoardTile } from "./../boardTiles/_BoardTile";
import G from "./../G";
import Coords from "./../util/Coords";
import _Actor from "./_Actor";
import _Npc from "./_Npc";

export default class Goomba extends _Npc {
    name = "Goomba";
    glyph = 'g';
    fgColor = ColorHelper.fromString("orange");
    bgColor = null;

    alive = true;

    constructor() {
        super();
    }

    act() {
        let freeCoords: Coords[] = [];
        let generator = G.board.tileLayer.iterateSurrounding(this.coords!);
        for (let coordsAndTile of generator) {
            const tile = coordsAndTile[1]!;
            if (tile.occupant() == G.player) {
                return this.meleeAttack();
            }
            else if (tile.passable && !tile.occupant())
                freeCoords.push(coordsAndTile[0]);
        }
        let selection = RNG.getItem(freeCoords);

        if (selection)
            this.move(selection);
    }

    meleeAttack() {
        G.log.write(`The Goomba nudges up against you.. aggressively`);
    }

    move(newCoords: Coords) {
        G.board.actorLayer.moveElement(this, newCoords);
        return true;
    }

    kill() {
        G.board.actorLayer.removeViaElement(this);
        G.board.npcManager.remove(this);
    }

}