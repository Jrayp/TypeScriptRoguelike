import { RNG } from "rot-js";
import _Action from "./actions/_Action";
import Goomba from "./actors/Goomba";
import Player from "./actors/Player";
import Board from "./Board";
import C from "./C";
import BoardDisplay from "./displays/BoardDisplay";
import LogDisplay from "./displays/LogDisplay";
import { ActionState } from "./Enums";
import Input from "./input/Input";
import Log from "./logging/Log";


export default class G {

    // TODO: Make private
    static readonly logDisplay: LogDisplay = new LogDisplay();
    static readonly boardDisplay: BoardDisplay = new BoardDisplay();

    static board: Board;
    static log: Log;
    static player: Player;

    static init() {
        document.body.append(G.logDisplay.getContainer()!);
        document.body.append(G.boardDisplay.getContainer()!);

        G.logDisplay.rect = G.logDisplay.getContainer()!.getBoundingClientRect();

        G.boardDisplay.rect = G.boardDisplay.getContainer()!.getBoundingClientRect();
        G.boardDisplay.width = C.BOARD_WIDTH;
        G.boardDisplay.height = C.BOARD_HEIGHT;
        G.boardDisplay.tileWidth = G.boardDisplay.rect.width / G.boardDisplay.width;
        G.boardDisplay.tileHeight = G.boardDisplay.rect.height / G.boardDisplay.height;

        G.log = new Log();
        G.board = new Board()
        G.board.generate();

        G.player = new Player();
        for (let tileAndPoint of G.board.tiles.iterateElements()) {
            if (tileAndPoint[0].name === "Floor") {
                G.board.actors.set(tileAndPoint[1], G.player);
                break;
            }
        }

        for (let tileAndPoint of G.board.tiles.iterateElements()) {
            if (tileAndPoint[0].passable && !tileAndPoint[0].occupant && RNG.getUniform() < .025) {
                let g = new Goomba();
                G.board.actors.set(tileAndPoint[1], g);
            }
        }

        G.board.lights.update();

        let playerSeenPoint = G.player.computeFov();
        G.board.draw(playerSeenPoint, G.player.percievedOpaqueColors);

        Input.setInputHandlers(G.logDisplay.getContainer()!, G.boardDisplay.getContainer()!);

        window.onscroll = G.recalculateCanvasRects;
        window.onresize = G.recalculateCanvasRects;

        G.log.write("Welcome to TypeScript Roguelike!");
    }

    private static recalculateCanvasRects() {
        G.boardDisplay.rect = G.boardDisplay.getContainer()!.getBoundingClientRect();
        G.logDisplay.rect = G.logDisplay.getContainer()!.getBoundingClientRect();
    }

    static draw() {
        G.board.draw(G.player.seenPoints, G.player.percievedOpaqueColors);
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
            G.updateAndDraw();
    }

    static updateAndDraw() {
        // Uh oh.. whaty about light so npc and thier vision??? 
        // Maybe doesnt matter they just have to see what they see before moving?
        G.board.actors.update();
        G.board.lights.update();
        G.player.computeFov();
        G.draw();
    }

}



