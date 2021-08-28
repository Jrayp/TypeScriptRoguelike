import { Color, FOV } from 'rot-js';
import SightHelper from './../interfaceHelpers/SightHelper';
import Sight from './../interfaces/Sight';
import G from "../G";
import { TryMoveResult } from './../Enums';
import Light from './../lights/Light';
import Coords from "./../util/Coords";
import _Actor from "./_Actor";

export default class Player extends _Actor implements Sight {
    name = "Player";
    glyph = '\u263B';
    fgColor = Color.fromString("brown");
    bgColor = null;

    light: Light;

    sightRange = 30;
    fov = new FOV.PreciseShadowcasting(SightHelper.sightPassesCallback);

    currentlySeenCoordKeys = new Set<string>();

    constructor() {
        super();

        this.light = new Light(this, 4, [175, 175, 175]);
        G.board.lightManager.addLight(this.light);
    }

    computeFov(): Set<string> {
        return SightHelper.computeFov(this);
    }

    tryMove(destCoords: Coords) {
        const destinationTile = G.board.tileLayer.getElementViaCoords(destCoords);

        const occupant = destinationTile.occupant();
        if (occupant) { // For now always enemy
            this.melee(G.board.actorLayer.getElementViaCoords(destCoords))
            G.log.write("*Poof* You kick the Goomba");
            return TryMoveResult.ENEMY;
        }

        if (!destinationTile.passable) {
            G.log.write("You bump into a wall!"); // Can be function on impassable types
            return TryMoveResult.IMPASSABLE;
        }

        G.board.actorLayer.moveElement(G.player, destCoords);
        const enterMessage = G.board.tileLayer.getElementViaCoords(destCoords).onEnter(G.player);
        if (enterMessage)
            G.log.write(enterMessage);

        return TryMoveResult.SUCCESFUL;
    }

    melee(npc: _Actor) {
        npc.kill();

    }



}
