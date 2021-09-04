import { RNG } from "rot-js";
import Goomba from "./actors/Goomba";
import Player from "./actors/Player";
import Board from "./Board";
import C from "./C";
import BoardDisplay from "./displays/BoardDisplay";
import LogDisplay from "./displays/LogDisplay";
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

        window.onscroll = G.recalculateCanvasRects;
        window.onresize = G.recalculateCanvasRects;

        G.log.write("Welcome to TypeScript Roguelike!");
    }


    private static recalculateCanvasRects() {
        G.boardDisplay.rect = G.boardDisplay.getContainer()!.getBoundingClientRect();
        G.logDisplay.rect = G.logDisplay.getContainer()!.getBoundingClientRect();
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



