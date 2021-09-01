import { RNG } from "rot-js";
import FireballAction from "./actions/FireballAction";
import _Action from "./actions/_Action";
import Goomba from "./actors/Goomba";
import Player from "./actors/Player";
import Board from "./Board";
import { GlowingCrystalTile } from "./boardTiles/GlowingCrystalTile";
import { RubbleTile } from "./boardTiles/RubbleTile";
import C from "./C";
import BoardDisplay from "./displays/BoardDisplay";
import LogDisplay from "./displays/LogDisplay";
import { Direction, GameState, TryMoveResult } from "./Enums";
import ITargetable from "./interfaces/ITargetable";
import Log from "./Log";
import Coords from "./util/Coords";
import GMath from "./util/GMath";


export default class G {

    // TODO: Make private
    static readonly boardDisplay: BoardDisplay = new BoardDisplay();
    static readonly logDisplay: LogDisplay = new LogDisplay();

    static board: Board;
    static log: Log;
    static player: Player;

    static state = GameState.PLAYER_CONTROL;

    static mouseX: number = 0;
    static mouseY: number = 0;

    static tileX: number = 0;
    static tileY: number = 0;

    static boardCanvas: HTMLElement;
    static boardCanvasRect: DOMRect;

    static tileWidth: number;
    static tileHeight: number;

    static currentTargeting : ITargetable;

    static init() {
        document.body.append(G.logDisplay.getContainer()!);
        document.body.append(G.boardDisplay.getContainer()!);

        G.boardCanvas = G.boardDisplay.getContainer()!;
        G.boardCanvasRect = G.boardCanvas.getBoundingClientRect();

        G.tileWidth = G.boardCanvasRect.width / C.BOARD_WIDTH;
        G.tileHeight = G.boardCanvasRect.height / C.BOARD_HEIGHT;

        G.log = new Log();
        G.board = new Board()
        G.board.generate();

        G.player = new Player();
        for (let tileAndCoords of G.board.tiles.iterateElements()) {
            if (tileAndCoords[0].name === "Floor") {
                G.board.actors.set(tileAndCoords[1], G.player);
                break;
            }
        }

        for (let tileAndCoords of G.board.tiles.iterateElements()) {
            if (tileAndCoords[0].passable && !tileAndCoords[0].occupant() && RNG.getUniform() < .025) {
                let g = new Goomba();
                G.board.actors.set(tileAndCoords[1], g);
            }
        }

        G.board.lights.update();

        let playerSeenCoords = G.player.computeFov();
        G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);

        G.initInputHandlers();

        G.log.write("Welcome to TypeScript Roguelike!");
    }

    private static initInputHandlers() {
        const instructions = document.getElementById('focus-instructions');
        G.boardCanvas.setAttribute('tabindex', "1");
        G.boardCanvas.addEventListener('keydown', G.handleKeyDown);
        G.boardCanvas.addEventListener('mousemove',G.handleMouseOver);
        // canvas.addEventListener('blur', () => { instructions!.classList.add('visible'); });
        // canvas.addEventListener('focus', () => { instructions!.classList.remove('visible'); });
        G.boardCanvas.focus();
    }


    static handleMouseOver(event: MouseEvent) {
        G.mouseX = event.clientX - G.boardCanvasRect.left;
        G.mouseY = event.clientY - G.boardCanvasRect.top;

        G.tileX = Math.floor(G.mouseX / G.tileWidth);
        G.tileY = Math.floor(G.mouseY / G.tileHeight);

        // G.board.icons.clear();
        // let fireballAction = new FireballAction();
        // let endCoords = Coords.addCoordsToCoords(G.player.coords!, GMath.DIR_COORDS[Direction.N]);
        // fireballAction.setTargetingIcons(G.player.coords!, new Coords(G.tileX, G.tileY));
        // G.boardDisplay.drawUI();
    }


    private static handleKeyDown(event: KeyboardEvent) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        let playerAction = G.determinePlayerAction(event.code);
        if (playerAction != undefined) {
            event.preventDefault();
            G.performPlayerAction(playerAction);
        }
    }


    private static determinePlayerAction(key: string): [string, number, number] | undefined {
        if (G.state != GameState.PLAYER_CONTROL)
            return undefined;

        switch (key) {
            case 'Numpad8': return ['move', 0, -1];
            case 'Numpad9': return ['move', +1, -1];
            case 'Numpad6': return ['move', +1, 0];
            case 'Numpad3': return ['move', +1, +1];
            case 'Numpad2': return ['move', 0, +1];
            case 'Numpad1': return ['move', -1, +1];
            case 'Numpad4': return ['move', -1, 0];
            case 'Numpad7': return ['move', -1, -1];
            case 'Numpad5': return ['wait', 0, 0];
            case 'KeyA': return ['write', 0, 0];
            case 'KeyL': return ['light', 0, 0];
            case 'KeyC': return ['crystal', 0, 0];
            case 'KeyF': return ['fireball', 0, 0];
            case 'KeyO': return ['circle', 0, 0];
            default: return undefined;
        }
    }

    private static performPlayerAction(action: [string, number, number]) {
        switch (action[0]) {
            case 'move':
                let currentPos = G.player.coords!;
                let destPos = Coords.addCoordsToNumbers(currentPos, action[1], action[2]);
                let result = G.player.tryMove(destPos);
                switch (result) {
                    case TryMoveResult.SUCCESFUL:
                        break;
                    case TryMoveResult.IMPASSABLE:
                        break;
                    case TryMoveResult.ENEMY:
                        break;
                }
                break;
            case 'write':
                G.log.write("You pressed A.. amazing!");
                break;
            case 'wait':
                break;
            case 'circle':
                for (let t of G.board.tiles.iterateCircumference(G.player.coords!, 1.5)) {
                    G.board.tiles.replace(t[0], new RubbleTile([255, 0, 255]));
                    // G.board.tiles.replace(t[0], new WallTile());

                }
                break;
            case 'fireball':
                G.board.icons.clear();
                let fireballAction = new FireballAction();
                let endCoords = Coords.addCoordsToCoords(G.player.coords!, GMath.DIR_COORDS[Direction.N]);
                fireballAction.setTargetingIcons(G.player.coords!, new Coords(G.mouseX, G.mouseY));
                G.boardDisplay.drawUI();
                // let startCoord = Coords.addCoordsToCoords(G.player.coords!, GMath.DIR_COORDS[Direction.N]);
                // G.board.effects.addEffect(startCoord, new FireballEffect(), false);
                // G.board.effects.handleEffects();
                return;
            case 'crystal':
                let coords = G.player.coords!;
                let tile = G.board.tiles.getElementViaCoords(coords);
                if (tile.name != "Glowing Crystal")
                    G.board.tiles.replace(coords, new GlowingCrystalTile());
                break;
            case 'light':
                if (G.player.light.active === true) {
                    G.log.write("You wave your hand over your glowing orb...");
                    G.player.light.active = false;
                }
                else {
                    G.log.write("You summon a glowing orb!");
                    G.player.light.active = true;
                }

                break;
        }

        // Uh oh.. whaty about light so npc and thier vision??? 
        // Maybe doesnt matter they just have to see what they see before moving?
        G.board.actors.update();
        G.board.lights.update();
        let playerSeenCoords = G.player.computeFov();
        G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
    }
}



