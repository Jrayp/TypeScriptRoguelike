import { Color as ColorHelper, FOV } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import { _BoardTile } from './../boardTiles/_BoardTile';
import Diggable from './../interfaces/Diggable';
import GMath from './../util/GMath';
import G from "../G";
import { TryMoveResult } from './../Enums';
import SightHelper from './../interfaceHelpers/SightHelper';
import Sight from './../interfaces/Sight';
import Light from './../lights/Light';
import Coords from "./../util/Coords";
import _Actor from "./_Actor";

export default class Player extends _Actor implements Sight {
    name = "Player";
    glyph = '\u263B';
    fgColor = ColorHelper.fromString("brown");
    bgColor = null;

    light: Light;

    sightRange = 30;
    fov = new FOV.PreciseShadowcasting(SightHelper.sightPassesCallback);

    seenCoords = new Set<string>();
    percievedOpaqueColors = new Map<string, Color>();

    constructor() {
        super();

        this.light = new Light(this, 4, [175, 175, 175]);
        G.board.lightManager.addLight(this.light);
    }

    computeFov(): Set<string> {
        const currentCoords = this.coords;
        this.seenCoords.clear();
        this.percievedOpaqueColors.clear();
        if (currentCoords) {
            this.fov.compute(currentCoords.x, currentCoords.y, this.sightRange,
                (x: number, y: number, r: number, visibility: number) => {
                    let coordsKey = Coords.makeKey(x, y);
                    if (G.board.lightManager.getBrightness(coordsKey)) {
                        let tile = G.board.tileLayer.getElementViaKey(coordsKey);
                        if (tile.transparent) {
                            {
                                this.seenCoords.add(coordsKey);
                                for (let n of G.board.tileLayer.iterateSurrounding(tile.coords)) {
                                    if (!n[1]?.transparent) {
                                        this.percievedOpaqueColors.set(n[0].key, [0, 0, 0]);
                                    }
                                }
                            }
                        }
                    }

                });
        }
        for (let opaque of this.percievedOpaqueColors) {
            let pc = G.board.lightManager.percievedLightColorOfOpaque(G.board.tileLayer.getElementViaKey(opaque[0]), this);
            if (pc) {
                this.percievedOpaqueColors.set(opaque[0], pc);
                this.seenCoords.add(opaque[0]);
            }
            else
                this.percievedOpaqueColors.delete(opaque[0]);
        }


        // for (let opaque of this.percievedOpaqueColors) {
        //     let tile = G.board.tileLayer.getElementViaKey(opaque[0]);
        //     let percievedColor = G.board.lightManager.percievedLightColorOfOpaque(tile, this);
        //     if (percievedColor) {
        //         this.seenCoords.add(opaque[0]);
        //         this.percievedOpaqueColors.set(opaque[0], percievedColor);
        //     }
        //     else
        //         this.percievedOpaqueColors.delete(opaque[0]);
        // }

        // else {
        //     let percievedColor = G.board.lightManager.percievedLightColorOfOpaque(tile, this);
        //     if(percievedColor)
        //         this.percievedOpaqueColors.set(coordsKey)
        // }

        // if (currentCoords) {
        //     this.fov.compute(currentCoords.x, currentCoords.y, this.sightRange,
        //         (x: number, y: number, r: number, visibility: number) => {
        //             let coordsKey = Coords.makeKey(x, y);
        //             let tile = G.board.tileLayer.getElementViaKey(coordsKey);
        //             if (G.board.lightManager.getBrightness(coordsKey))
        //                 if (tile.transparent) {
        //                     this.seenCoords.add(coordsKey);
        //                 }
        //                 else {
        //                     let percievedColor = G.board.lightManager.percievedLightColorOfOpaque(tile, this);
        //                     if (percievedColor) {
        //                         this.seenCoords.add(coordsKey);
        //                         this.percievedOpaqueColors.set(coordsKey, percievedColor!);
        //                     }
        //                 }
        //         });
        // }
        return this.seenCoords;
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
            if (this.isDiggable(destinationTile)) {
                destinationTile.dig();
            }
            // G.log.write("You bump into a wall!"); // Can be function on impassable types
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

    isDiggable(tile: _BoardTile | Diggable): tile is Diggable {
        return 'dig' in tile;
    }



}
