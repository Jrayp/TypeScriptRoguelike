import { FOV } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import G from "../G";
import { isDiggable } from '../interfaces/IDiggable';
import ISight from '../interfaces/ISight';
import AttackAction from './../actions/AttackAction';
import DigAction from './../actions/DigAction';
import MoveAction from './../actions/MoveAction';
import { Direction } from './../Enums';
import SightHelper from './../interfaceHelpers/SightHelper';
import Light from './../lights/Light';
import Coords from "./../util/Coords";
import _Actor from "./_Actor";


export default class Player extends _Actor implements ISight {
    name = "Player";
    _glyph = '@';
    _fgColor = [255, 0, 0] as Color;
    _bgColor = null;

    get bgColor() {
        if (!G.board.lights.getBrightness(this.coords!.key))
            return [75, 0, 130];
        else return this._bgColor;
    }

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

        // TODO: Just make the light not shine on the wall if the player cant see the neighboring
        // floor tiles..

        // Get all the coords in the players FOV and add opaque coords to a map
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

        // Set percieved color of opaque tiles to that of the brightest neighboring floor tile
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

    getAction(keyCode: string) {
        switch (keyCode) {
            case 'Numpad8': return this.tryMove(this.coords!.neighbor(Direction.N));
            case 'Numpad9': return this.tryMove(this.coords!.neighbor(Direction.NE));
            case 'Numpad6': return this.tryMove(this.coords!.neighbor(Direction.E));
            case 'Numpad3': return this.tryMove(this.coords!.neighbor(Direction.SE));
            case 'Numpad2': return this.tryMove(this.coords!.neighbor(Direction.S));
            case 'Numpad1': return this.tryMove(this.coords!.neighbor(Direction.SW));
            case 'Numpad4': return this.tryMove(this.coords!.neighbor(Direction.W));
            case 'Numpad7': return this.tryMove(this.coords!.neighbor(Direction.NW));
            // case 'Numpad5': return; // Wait
            // case 'KeyA': return ['write', 0, 0];
            // case 'KeyL': return ['light', 0, 0];
            // case 'KeyC': return ['crystal', 0, 0];
            // case 'KeyF': return ['fireball', 0, 0];
            // case 'KeyO': return ['circle', 0, 0];
            default: return undefined;
        }
    }

    tryMove(destCoords: Coords) {
        const destinationTile = G.board.tiles.getElementViaCoords(destCoords);

        const occupant = destinationTile.occupant();
        if (occupant) { // For now always enemy
            return new AttackAction(occupant);
        }
        else if (!destinationTile.passable) {
            if (isDiggable(destinationTile)) {
                return new DigAction(destinationTile);
            }
            return undefined;
        }

        return new MoveAction(this, destCoords);
    }


}
