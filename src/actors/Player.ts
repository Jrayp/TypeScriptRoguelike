import { FOV } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import DebugAction from '../actions/DebugAction';
import G from "../G";
import { isDiggable } from '../interfaces/IDiggable';
import ISight from '../interfaces/ISight';
import Point from "../util/Point";
import AttackAction from './../actions/AttackAction';
import DigAction from './../actions/DigAction';
import MoveAction from './../actions/MoveAction';
import SwitchAction from './../actions/SwitchAction';
import WaitAction from './../actions/WaitAction';
import _Action from './../actions/_Action';
import { GlowingCrystalTile } from './../boardTiles/GlowingCrystalTile';
import { ActionState, Direction, Layer, SwitchSetting } from './../Enums';
import SightHelper from './../interfaceHelpers/SightHelper';
import Light from './../lights/Light';
import _Actor from "./_Actor";


export default class Player extends _Actor implements ISight {
    name = "Player";
    _glyph = '@';
    _fgColor = [255, 0, 0] as Color;
    _bgColor = null;

    get bgColor() {
        if (!G.board.lights.getBrightness(this.position!.key))
            return [75, 0, 130];
        else return this._bgColor;
    }

    light: Light;

    sightPassesCallback = (x: number, y: number) => {
        if (!G.board.numbersWithinBounds(x, y))
            return false;
        else
            return G.board.tiles.getElementViaKey(Point.toKey(x, y, this.position!.layer)).transparent;
    }

    // Sight properties
    get sightRange() {
        return this.position!.layer == Layer.BELOW ? 4 : 30;
    }
    seenPoints = new Set<number>();
    percievedOpaqueColors = new Map<number, Color>();
    fovAlgo = new FOV.PreciseShadowcasting(this.sightPassesCallback);

    submerged = false;

    constructor() {
        super();

        this.light = new Light(this, 4, [175, 175, 175]);
        G.board.lights.addLight(this.light);
    }



    computeFov(): Set<number> {
        const thisPoint = this.position!;
        this.seenPoints.clear();
        this.percievedOpaqueColors.clear();
        let placeHolderColor: Color = [0, 0, 0];
        let tiles = G.board.tiles;
        let playerZ = this.position!.layer;

        // TODO: Just make the light not shine on the wall if the player cant see the neighboring
        // floor tiles..

        // Get all the Point in the players FOV and add opaque Point to a map
        this.fovAlgo.compute(thisPoint.x, thisPoint.y, this.sightRange,
            (x: number, y: number, r: number, visibility: number) => {
                let pointKey = Point.toKey(x, y, playerZ);
                if (G.board.lights.getBrightness(pointKey)) {
                    let tile = tiles.getElementViaKey(pointKey);
                    if (tile.transparent) {
                        this.seenPoints.add(pointKey);
                    } else {
                        this.percievedOpaqueColors.set(pointKey, placeHolderColor);
                    }
                }
            });

        // Set percieved color of opaque tiles to that of the brightest neighboring floor tile
        // that the player can see.
        for (let opaqueKeyAndColor of this.percievedOpaqueColors) {
            let pointKey = opaqueKeyAndColor[0];
            let tile = tiles.getElementViaKey(pointKey);
            let percievedColor = G.board.lights.percievedLightColorOfOpaque(tile, this)!;
            if (percievedColor) {
                this.percievedOpaqueColors.set(pointKey, percievedColor);
                this.seenPoints.add(pointKey);
            }
        }

        this.seenPoints.add(thisPoint.key);
        return this.seenPoints;
    }

    getAction(keyCode: string): _Action | undefined {
        switch (keyCode) {
            case 'Numpad8': return this.tryMove(this.position!.neighbor(Direction.N));
            case 'Numpad9': return this.tryMove(this.position!.neighbor(Direction.NE));
            case 'Numpad6': return this.tryMove(this.position!.neighbor(Direction.E));
            case 'Numpad3': return this.tryMove(this.position!.neighbor(Direction.SE));
            case 'Numpad2': return this.tryMove(this.position!.neighbor(Direction.S));
            case 'Numpad1': return this.tryMove(this.position!.neighbor(Direction.SW));
            case 'Numpad4': return this.tryMove(this.position!.neighbor(Direction.W));
            case 'Numpad7': return this.tryMove(this.position!.neighbor(Direction.NW));
            case 'Numpad5': return new WaitAction();
            case 'KeyL': return new SwitchAction(this.light, SwitchSetting.TOGGLE).logAfterConditional(() => {
                return this.light.active ? 'You summon a glowing orb.' : 'You wave your hand over your orb..';
            });
            case 'KeyC':
                let da = new DebugAction(() => {
                    let tile = G.board.tiles.getElementViaPoint(this.position!);
                    if (tile.name != "Glowing Crystal") {
                        G.board.tiles.replace(this.position!, new GlowingCrystalTile());
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

    tryMove(destPoint: Point) {
        const destinationTile = G.board.tiles.getElementViaPoint(destPoint);

        const occupant = destinationTile.occupant;
        if (occupant) { // For now always enemy
            return new AttackAction(occupant);
        }
        else if (!destinationTile.passable) {
            if (isDiggable(destinationTile)) {
                return new DigAction(destinationTile);
            }
            return undefined;
        }

        return new MoveAction(this, destPoint);
    }

    tryEnter() {
        // Make enterable tiles inherit from an appropriate interface
        if (G.player.tile!.name === "Water" && this.submerged == false) {
            this.submerged = true;
            G.updateAndDraw();
        }
    }

}
