import { FOV } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import PreciseShadowcasting from 'rot-js/lib/fov/precise-shadowcasting';
import _DiggableTile from './../boardTiles/_DiggableTile';
import DebugAction from '../actions/DebugAction';
import G from "../G";
import ISight from '../interfaces/ISight';
import Cell from "../util/Cell";
import AttackAction from './../actions/AttackAction';
import DigAction from './../actions/DigAction';
import MoveAction from './../actions/MoveAction';
import SwitchAction from './../actions/SwitchAction';
import WaitAction from './../actions/WaitAction';
import _Action from './../actions/_Action';
import { GlowingCrystalTile } from './../boardTiles/GlowingCrystalTile';
import { ActionState, Dir, Layer, SwitchSetting } from './../Enums';
import Light from './../lights/Light';
import _Actor from "./_Actor";
import Sound from './../audio/Sound';


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

    seenCells = new Set<Cell>();
    percievedOpaqueColors = new Map<Cell, Color>();

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
        let cell = Cell.get(x, y, this.position!.layer);
        if (cell) {
            return G.board.tiles.getElementViaCell(cell).transparent;
        }
        else {
            return false;
        }
    }

    fovCallback = (x: number, y: number, r: number, visibility: number) => {
        let cell = Cell.get(x, y, this.position!.layer)!;
        if (G.board.lights.getBrightness(cell)) {
            let tile = G.board.tiles.getElementViaCell(cell);
            if (tile.transparent) {
                this.seenCells.add(cell);
            } else {
                this.percievedOpaqueColors.set(cell, G.board.lights.baseColor);
            }
        }
    }

    ///////////////////////////////////////////////////////
    // Fov Computation
    ///////////////////////////////////////////////////////

    // TODO: Just make the light not shine on the wall if the player cant see the neighboring
    // floor tiles..

    computeFov(): Set<Cell> {
        const pos = this.position!;

        this.seenCells.clear();
        this.percievedOpaqueColors.clear();

        // Get all the cells in the players FOV and add opaque cells to a map
        this._fovAlgorithm.compute(pos.x, pos.y, this.sightRange, this.fovCallback);

        // Set percieved color of opaque tiles to that of the brightest neighboring 
        // floor tile that the player can see.
        for (let opaqueCellAndColor of this.percievedOpaqueColors) {
            let cell = opaqueCellAndColor[0];
            let tile = G.board.tiles.getElementViaCell(cell);
            let percievedColor = G.board.lights.percievedLightColorOfOpaque(tile, this);
            if (percievedColor) {
                this.percievedOpaqueColors.set(cell, percievedColor);
                this.seenCells.add(cell);
            }
        }

        // Always see the tile youre on
        this.seenCells.add(pos);
        return this.seenCells;
    }

    ///////////////////////////////////////////////////////
    // Actions
    ///////////////////////////////////////////////////////

    getAction(keyCode: string): _Action | undefined {
        switch (keyCode) {
            case 'Numpad8': return this.tryMove(this.position!.neighbor(Dir.N)!);
            case 'Numpad9': return this.tryMove(this.position!.neighbor(Dir.NE)!);
            case 'Numpad6': return this.tryMove(this.position!.neighbor(Dir.E)!);
            case 'Numpad3': return this.tryMove(this.position!.neighbor(Dir.SE)!);
            case 'Numpad2': return this.tryMove(this.position!.neighbor(Dir.S)!);
            case 'Numpad1': return this.tryMove(this.position!.neighbor(Dir.SW)!);
            case 'Numpad4': return this.tryMove(this.position!.neighbor(Dir.W)!);
            case 'Numpad7': return this.tryMove(this.position!.neighbor(Dir.NW)!);
            case 'Numpad5': return new WaitAction().logAfter("You wait..");
            case 'KeyL': return new SwitchAction(this._lightOrb, SwitchSetting.TOGGLE).logAfterConditional(() => {
                return this._lightOrb.isActive ? 'You summon a glowing orb.' : 'You wave your hand over your orb..';
            });
            case 'KeyC':
                let da = new DebugAction(() => {
                    let tile = G.board.tiles.getElementViaCell(this.position!);
                    if (tile.name != "Glowing Crystal") {
                        G.board.tiles.replace(this.position!, new GlowingCrystalTile());
                        return ActionState.SUCCESSFUL;
                    }
                    else return ActionState.UNSUCCESSFUL;
                }).logAfterConditional(() => { return da.state === ActionState.SUCCESSFUL ? "You place a glowing crystal." : "There is already a crystal here." });
                return da;
            // case 'KeyS':
            //     return new DebugAction(() => {
            //         let s = new Sound(this.position!);
            //         G.board.sounds.add(s);
            //         G.board.sounds.update();
            //         return ActionState.SUCCESSFUL;
            //     });
            default: return undefined;
        }
    }

    tryMove(destCell: Cell) {
        const destinationTile = G.board.tiles.getElementViaCell(destCell);

        const occupant = destinationTile.occupant();
        if (occupant) { // For now always enemy
            return new AttackAction(occupant);
        }
        else if (!destinationTile.passable) {
            if (destinationTile instanceof _DiggableTile) {
                return new DigAction(destinationTile);
            }
            return undefined;
        }

        return new MoveAction(this, destCell);
    }



}
