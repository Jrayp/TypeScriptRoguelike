import * as Pizzicato from 'pizzicato';
import { RNG } from "rot-js";
import Board from "./Board";
import { ActionState } from "./Enums";
import _Action from "./actions/_Action";
import AnglerFish from "./actors/AnglerFish";
import Goomba from "./actors/Goomba";
import Player from "./actors/Player";
import BoardDisplay from "./displays/BoardDisplay";
import LogDisplay from "./displays/LogDisplay";
import Input from "./input/Input";
import Log from "./logging/Log";

export default class G {

    private static readonly _logDisplay: LogDisplay = new LogDisplay();
    private static readonly _boardDisplay: BoardDisplay = new BoardDisplay();

    static board: Board;
    static log: Log;
    static player: Player;

    static init() {
        // RNG.setSeed(-123);

        document.body.append(G._logDisplay.getContainer()!);
        document.body.append(G._boardDisplay.getContainer()!);

        G.log = new Log(G._logDisplay);
        G._boardDisplay.init();
        G.board = new Board()
        G.board.generate();

        G.player = new Player();
        for (let tileAndCell of G.board.tiles.iterateElements()) {
            if (tileAndCell[0].name === "Floor") {
                G.board.actors.set(tileAndCell[1], G.player);
                break;
            }
        }

        for (let tileAndCell of G.board.tiles.iterateElements()) {
            if (tileAndCell[0].passable && tileAndCell[0].layer == 0 && !tileAndCell[0].occupant() && RNG.getUniform() < .025) {
                let g = new Goomba();
                G.board.actors.set(tileAndCell[1], g);
            }
        }

        for (let tileAndCell of G.board.tiles.iterateElements()) {
            if (tileAndCell[0].passable && tileAndCell[0].position!.layer == 1 && !tileAndCell[0].occupant() && RNG.getUniform() < .01) {
                let f = new AnglerFish();
                G.board.actors.set(tileAndCell[1], f);
            }
        }




        G.board.lights.update();
        G.player.computeFov();
        G.drawBoard();

        Input.init(G._logDisplay, G._boardDisplay);

        window.onscroll = G.recalculateCanvasRects;
        window.onresize = G.recalculateCanvasRects;

        window.onclick = G.resumeSoundContext;

        window.onblur = G.stopSoundContext;

        G.log.write("Welcome to TypeScript Roguelike!");

        G.board.sounds.init();

        // while (true) {
        //     let x = RNG.getUniformInt(0, C.BOARD_WIDTH - 1);
        //     let y = RNG.getUniformInt(0, C.BOARD_HEIGHT - 1);
        //     let tile = G.board.tiles.getElementViaXYZ(x, y, 0);
        //     if (tile.name == "Floor") {
        //         G.board.sounds.add(new Sound(Cell.get(x, y, 0)!));
        //         G.board.sounds.update();
        //         G.player.soundPos = Cell.get(x, y, 0)!;
        //         break;
        //     }
        // }
    }

    private static recalculateCanvasRects() {
        G._boardDisplay.rect = G._boardDisplay.getContainer()!.getBoundingClientRect();
        G._logDisplay.rect = G._logDisplay.getContainer()!.getBoundingClientRect();
    }

    private static resumeSoundContext() {
        Pizzicato.context.resume();
    }


    private static stopSoundContext() {
        Pizzicato.context.suspend();
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
        G.board.sounds.update();

    }

    static drawBoard() {
        G._boardDisplay.drawBoard(G.board, G.player.seenCells, G.player.percievedOpaqueColors);

    }

}



