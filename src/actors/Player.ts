import { FOV } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import PreciseShadowcasting from 'rot-js/lib/fov/precise-shadowcasting';
import _DiggableTile from './../boardTiles/_DiggableTile';
import DebugAction from '../actions/DebugAction';
import G from "../G";
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
import Light from './../lights/Light';
import _Actor from "./_Actor";


export default class Player extends _Actor implements ISight {
    name = 'Player';

    ///////////////////////////////////////////////////////
    // Drawable Properties
    ///////////////////////////////////////////////////////

    _glyph = '@';
    _fgColor = [255, 0, 0] as Color;
    _bgColor = null;

    get bgColor() {
        if (!G.board.lights.getBrightness(this.position!))
            return [75, 0, 130];
        else return this._bgColor;
    }

    ///////////////////////////////////////////////////////
    // Sight properties
    ///////////////////////////////////////////////////////

    seenPoints = new Set<Point>();
    percievedOpaqueColors = new Map<Point, Color>();

    get sightRange() {
        return this.position!.layer == Layer.BELOW ? 4 : 30;
    }

    private _fovAlgorithm: PreciseShadowcasting;

    ///////////////////////////////////////////////////////
    // Misc Properties
    ///////////////////////////////////////////////////////

    private _lightOrb: Light;

    ///////////////////////////////////////////////////////
    // Constructor
    ///////////////////////////////////////////////////////

    constructor() {
        super();
        this._fovAlgorithm = new FOV.PreciseShadowcasting(this.sightPassesCallback);
        this._lightOrb = new Light(this, 4, [175, 175, 175]);
        G.board.lights.addLight(this._lightOrb);
    }

    ///////////////////////////////////////////////////////
    // Fov Callbacks
    ///////////////////////////////////////////////////////

    sightPassesCallback = (x: number, y: number) => {
        let point = Point.get(x, y, this.position!.layer);
        if (point) {
            return G.board.tiles.getElementViaPoint(point).transparent;
        }
        else {
            return false;
        }
    }

    fovCallback = (x: number, y: number, r: number, visibility: number) => {
        let point = Point.get(x, y, this.position!.layer)!;
        if (G.board.lights.getBrightness(point)) {
            let tile = G.board.tiles.getElementViaPoint(point);
            if (tile.transparent) {
                this.seenPoints.add(point);
            } else {
                this.percievedOpaqueColors.set(point, G.board.lights.baseColor);
            }
        }
    }

    ///////////////////////////////////////////////////////
    // Fov Computation
    ///////////////////////////////////////////////////////

    // TODO: Just make the light not shine on the wall if the player cant see the neighboring
    // floor tiles..

    computeFov(): Set<Point> {
        const pos = this.position!;

        this.seenPoints.clear();
        this.percievedOpaqueColors.clear();

        // Get all the points in the players FOV and add opaque points to a map
        this._fovAlgorithm.compute(pos.x, pos.y, this.sightRange, this.fovCallback);

        // Set percieved color of opaque tiles to that of the brightest neighboring 
        // floor tile that the player can see.
        for (let opaquePointAndColor of this.percievedOpaqueColors) {
            let point = opaquePointAndColor[0];
            let tile = G.board.tiles.getElementViaPoint(point);
            let percievedColor = G.board.lights.percievedLightColorOfOpaque(tile, this);
            if (percievedColor) {
                this.percievedOpaqueColors.set(point, percievedColor);
                this.seenPoints.add(point);
            }
        }

        // Always see the tile youre on
        this.seenPoints.add(pos);
        return this.seenPoints;
    }

    ///////////////////////////////////////////////////////
    // Actions
    ///////////////////////////////////////////////////////

    getAction(keyCode: string): _Action | undefined {
        switch (keyCode) {
            case 'Numpad8': return this.tryMove(this.position!.neighbor(Direction.N)!);
            case 'Numpad9': return this.tryMove(this.position!.neighbor(Direction.NE)!);
            case 'Numpad6': return this.tryMove(this.position!.neighbor(Direction.E)!);
            case 'Numpad3': return this.tryMove(this.position!.neighbor(Direction.SE)!);
            case 'Numpad2': return this.tryMove(this.position!.neighbor(Direction.S)!);
            case 'Numpad1': return this.tryMove(this.position!.neighbor(Direction.SW)!);
            case 'Numpad4': return this.tryMove(this.position!.neighbor(Direction.W)!);
            case 'Numpad7': return this.tryMove(this.position!.neighbor(Direction.NW)!);
            case 'Numpad5': return new WaitAction().logAfter("You wait..");
            case 'KeyL': return new SwitchAction(this._lightOrb, SwitchSetting.TOGGLE).logAfterConditional(() => {
                return this._lightOrb.isActive ? 'You summon a glowing orb.' : 'You wave your hand over your orb..';
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
            if (destinationTile instanceof _DiggableTile) {
                return new DigAction(destinationTile);
            }
            return undefined;
        }

        return new MoveAction(this, destPoint);
    }



}
