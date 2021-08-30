import { FOV } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import G from "../G";
import { TryMoveResult } from './../Enums';
import SightHelper from './../interfaceHelpers/SightHelper';
import { isDiggable } from './../interfaces/Diggable';
import Sight from './../interfaces/Sight';
import Light from './../lights/Light';
import Coords from "./../util/Coords";
import _Actor from "./_Actor";

export default class Player extends _Actor implements Sight {
    name = "Player";
    _glyph = '@';
    _fgColor = [150, 75, 0] as Color;
    _bgColor = null;

    light: Light;

    // Sight properties
    sightRange = 30;
    seenCoords = new Set<string>();
    percievedOpaqueColors = new Map<string, Color>();
    fovAlgo = new FOV.PreciseShadowcasting(SightHelper.sightPassesCallback);

    constructor() {
        super();

        this.light = new Light(this, 4, [175, 175, 175]);
        G.board.lights.addLight(this.light);
    }

    computeFov(): Set<string> {
        const thisCoords = this.coords!;
        this.seenCoords.clear();
        this.percievedOpaqueColors.clear();
        let placeHolderColor: Color = [0, 0, 0];

        // Get all the coords in the players FOV and add opaue coords to the map
        this.fovAlgo.compute(thisCoords.x, thisCoords.y, this.sightRange,
            (x: number, y: number, r: number, visibility: number) => {
                let coordsKey = Coords.makeKey(x, y);
                if (G.board.lights.getBrightness(coordsKey)) {
                    let tile = G.board.tiles.getElementViaKey(coordsKey);
                    if (tile.transparent) {
                        this.seenCoords.add(coordsKey);
                    } else {
                        this.percievedOpaqueColors.set(coordsKey, placeHolderColor);
                    }
                }
            });

        // Set percieved color of opaque tiles to that of teh brightest neighboring floor tile
        // that the player can see.
        for (let opaqueKeyAndColor of this.percievedOpaqueColors) {
            let coordsKey = opaqueKeyAndColor[0];
            let tile = G.board.tiles.getElementViaKey(coordsKey);
            let percievedColor = G.board.lights.percievedLightColorOfOpaque(tile, this)!;
            if (percievedColor) {
                this.percievedOpaqueColors.set(coordsKey, percievedColor);
                this.seenCoords.add(coordsKey);
            }
        }

        this.seenCoords.add(thisCoords.key);
        return this.seenCoords;
    }

    tryMove(destCoords: Coords) {
        const destinationTile = G.board.tiles.getElementViaCoords(destCoords);

        const occupant = destinationTile.occupant();
        if (occupant) { // For now always enemy
            this.melee(G.board.actors.getElementViaCoords(destCoords))
            G.log.write("*Poof* You kick the Goomba");
            return TryMoveResult.ENEMY;
        }

        if (!destinationTile.passable) {
            if (isDiggable(destinationTile)) {
                destinationTile.dig();
            }
            // G.log.write("You bump into a wall!"); // Can be function on impassable types
            return TryMoveResult.IMPASSABLE;
        }

        G.board.actors.moveElement(G.player, destCoords);
        const enterMessage = G.board.tiles.getElementViaCoords(destCoords).onEnter(G.player);
        if (enterMessage)
            G.log.write(enterMessage);

        return TryMoveResult.SUCCESFUL;
    }

    melee(npc: _Actor) {
        npc.kill();

    }
}
