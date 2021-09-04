import { FOV } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import WaitAction from './../actions/WaitAction';
import G from "../G";
import { isDiggable } from '../interfaces/IDiggable';
import ISight from '../interfaces/ISight';
import AttackAction from './../actions/AttackAction';
import DigAction from './../actions/DigAction';
import MoveAction from './../actions/MoveAction';
import { ActionState, Direction, SwitchSetting } from './../Enums';
import SightHelper from './../interfaceHelpers/SightHelper';
import Light from './../lights/Light';
import Coords from "../util/Coords";
import _Actor from "./_Actor";
import _Action from './../actions/_Action';
import SwitchAction from './../actions/SwitchAction';
import DebugAction from '../actions/DebugAction';
import { GlowingCrystalTile } from './../boardTiles/GlowingCrystalTile';
import Action from 'rot-js/lib/scheduler/action';


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
    seenCoords = new Set<number>();
    percievedOpaqueColors = new Map<number, Color>();
    fovAlgo = new FOV.PreciseShadowcasting(SightHelper.sightPassesCallback);

    constructor() {
        super();

        this.light = new Light(this, 4, [175, 175, 175]);
        G.board.lights.addLight(this.light);
    }

    computeFov(): Set<number> {
        const thisCoords = this.coords!;
        this.seenCoords.clear();
        this.percievedOpaqueColors.clear();
        let placeHolderColor: Color = [0, 0, 0];

        // TODO: Just make the light not shine on the wall if the player cant see the neighboring
        // floor tiles..

        // Get all the coords in the players FOV and add opaque coords to a map
        this.fovAlgo.compute(thisCoords.x, thisCoords.y, this.sightRange,
            (x: number, y: number, r: number, visibility: number) => {
                let coordsKey = Coords.toInt(x, y);
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

    getAction(keyCode: string): _Action | undefined {
        switch (keyCode) {
            case 'Numpad8': return this.tryMove(this.coords!.neighbor(Direction.N));
            case 'Numpad9': return this.tryMove(this.coords!.neighbor(Direction.NE));
            case 'Numpad6': return this.tryMove(this.coords!.neighbor(Direction.E));
            case 'Numpad3': return this.tryMove(this.coords!.neighbor(Direction.SE));
            case 'Numpad2': return this.tryMove(this.coords!.neighbor(Direction.S));
            case 'Numpad1': return this.tryMove(this.coords!.neighbor(Direction.SW));
            case 'Numpad4': return this.tryMove(this.coords!.neighbor(Direction.W));
            case 'Numpad7': return this.tryMove(this.coords!.neighbor(Direction.NW));
            case 'Numpad5': return new WaitAction();
            case 'KeyL': return new SwitchAction(this.light, SwitchSetting.TOGGLE).logAfterConditional(() => {
                return this.light.active ? 'You summon a glowing orb.' : 'You wave your hand over your orb..';
            });
            case 'KeyC':
                let da = new DebugAction(() => {
                    let tile = G.board.tiles.getElementViaCoords(this.coords!);
                    if (tile.name != "Glowing Crystal") {
                        G.board.tiles.replace(this.coords!, new GlowingCrystalTile());
                        return ActionState.SUCCESSFUL;
                    }
                    else return ActionState.UNSUCCESSFUL;
                }).logAfterConditional(() => { return da.state === ActionState.SUCCESSFUL ? "You place a glowing crystal." : "There is already a crystal here." });
                return da;
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
