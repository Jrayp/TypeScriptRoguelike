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
import Input from "./input/Input";
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

    static tileWidth: number;
    static tileHeight: number;

    static currentTargetable: ITargetable;

    static init() {
        document.body.append(G.logDisplay.getContainer()!);
        document.body.append(G.boardDisplay.getContainer()!);

        // G.boardCanvas = G.boardDisplay.getContainer()!;
        // G.boardCanvasRect = G.boardCanvas.getBoundingClientRect();

        // G.tileWidth = G.boardCanvasRect.width / C.BOARD_WIDTH;
        // G.tileHeight = G.boardCanvasRect.height / C.BOARD_HEIGHT;

        G.log = new Log();
        G.board = new Board()
        G.board.generate();

        G.currentTargetable = new FireballAction();

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

        Input.setInputHandlers(G.logDisplay.getContainer()!, G.boardDisplay.getContainer()!);

        G.log.write("Welcome to TypeScript Roguelike!");
    }

    static update() {
        // Uh oh.. whaty about light so npc and thier vision??? 
        // Maybe doesnt matter they just have to see what they see before moving?
        G.board.actors.update();
        G.board.lights.update();
        let playerSeenCoords = G.player.computeFov();
        G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
    }

}



