import { Howl, Howler } from "howler";
import { RNG } from "rot-js";
import _Action from "./actions/_Action";
import AnglerFish from "./actors/AnglerFish";
import Goomba from "./actors/Goomba";
import Player from "./actors/Player";
import Board from "./Board";
import C from "./C";
import { Icon } from "./controllers/UIController";
import BoardDisplay from "./displays/BoardDisplay";
import LogDisplay from "./displays/LogDisplay";
import { ActionState, Layer } from "./Enums";
import Input from "./input/Input";
import Log from "./logging/Log";
import GMath from "./util/GMath";
import Point from "./util/Point";


export default class G {

    private static readonly _logDisplay: LogDisplay = new LogDisplay();
    private static readonly _boardDisplay: BoardDisplay = new BoardDisplay();

    static board: Board;
    static log: Log;
    static player: Player;

    static init() {
        RNG.setSeed(-123);

        document.body.append(G._logDisplay.getContainer()!);
        document.body.append(G._boardDisplay.getContainer()!);

        G.log = new Log(G._logDisplay);
        G._boardDisplay.init();
        G.board = new Board()
        G.board.generate();

        G.player = new Player();
        G.board.actors.set(Point.get(2, 1, 0)!, G.player);

        // G.board.actors.set(Point.get(Math.floor(C.BOARD_WIDTH / 2), Math.floor(C.BOARD_HEIGHT / 2), 0)!, G.player);
        // for (let tileAndPoint of G.board.tiles.iterateElements()) {
        //     if (tileAndPoint[0].name === "Floor") {
        //         G.board.actors.set(tileAndPoint[1], G.player);
        //         break;
        //     }
        // }
        Howler.pos(G.player.position!.x, G.player.position!.y, 0);

        for (let tileAndPoint of G.board.tiles.iterateElements()) {
            if (tileAndPoint[0].passable && tileAndPoint[0].position!.layer == 0 && !tileAndPoint[0].occupant && RNG.getUniform() < .025) {
                let g = new Goomba();
                G.board.actors.set(tileAndPoint[1], g);
            }
        }

        for (let tileAndPoint of G.board.tiles.iterateElements()) {
            if (tileAndPoint[0].passable && tileAndPoint[0].position!.layer == 1 && !tileAndPoint[0].occupant && RNG.getUniform() < .01) {
                let f = new AnglerFish();
                G.board.actors.set(tileAndPoint[1], f);
            }
        }

        G.board.lights.update();
        G.player.computeFov();
        G.drawBoard();

        Input.init(G._logDisplay, G._boardDisplay);

        window.onscroll = G.recalculateCanvasRects;
        window.onresize = G.recalculateCanvasRects;

        G.board.paths.init();

        G.log.write("Welcome to TypeScript Roguelike!");

    }

    private static recalculateCanvasRects() {
        G._boardDisplay.rect = G._boardDisplay.getContainer()!.getBoundingClientRect();
        G._logDisplay.rect = G._logDisplay.getContainer()!.getBoundingClientRect();
    }

    static handleAction(action: _Action) {
        if (action.beforeLogCallback)
            G.log.write(action.beforeLogCallback());

        action.state = ActionState.PERFORMING;
        action.state = action.perform();

        if (action.afterLogCallback)
            G.log.write(action.afterLogCallback());

        if (action.state == ActionState.START_EFFECT)
            G.board.effects.handleEffects();
        else
            G.updateAndDrawBoard();
    }

    static updateAndDrawBoard() {
        G.board.actors.update();
        G.board.lights.update();
        G.player.computeFov();
        G.drawBoard();

        // G.board.sounds.update();
    }

    static drawBoard() {
        G._boardDisplay.drawBoard(G.board, G.player.seenPoints, G.player.percievedOpaqueColors);
    }

}



