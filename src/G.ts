import { RNG } from "rot-js";
import Goomba from "./actors/Goomba";
import Player from "./actors/Player";
import Board from "./Board";
import BoardDisplay from "./displays/BoardDisplay";
import LogDisplay from "./displays/LogDisplay";
import Light from "./lights/Light";
import Log from "./Log";
import Coords from "./util/Coords";


export default class G {

    // TODO: Make private
    static readonly boardDisplay: BoardDisplay = new BoardDisplay();
    static readonly logDisplay: LogDisplay = new LogDisplay();

    static board: Board;
    static log: Log;
    static player: Player;

    static playerLight: Light;

    static init() {
        document.body.append(G.logDisplay.getContainer()!);
        document.body.append(G.boardDisplay.getContainer()!);

        G.log = new Log();
        G.board = new Board();
        G.board.generate();

        G.player = new Player();
        for (let tileAndCoords of G.board.tileLayer.iterator()) {
            if (tileAndCoords[0].name === "Floor") {
                G.board.actorLayer.set(tileAndCoords[1], G.player);
                break;
            }
        }

        let posList: Coords[] = [];
        for (let tileAndCoords of G.board.tileLayer.iterator()) {
            if (tileAndCoords[0].passable && !tileAndCoords[0].occupiedByActor() && RNG.getUniform() < .025) {
                G.board.actorLayer.set(tileAndCoords[1], new Goomba());
            }
        }

        G.playerLight = new Light(G.player, 8, [150, 150, 150]);
        G.board.lightManager.addLight(G.playerLight);

        G.initInputHandlers();

        let playerSeenCoords = G.player.computeFov();

        G.board.lightManager.update();

        G.board.draw(playerSeenCoords);

        G.log.write("Welcome to TypeScript Roguelike!");
    }

    private static initInputHandlers() {
        const canvas = G.boardDisplay.getContainer()!;
        const instructions = document.getElementById('focus-instructions');
        canvas.setAttribute('tabindex', "1");
        canvas.addEventListener('keydown', G.handleKeyDown);
        // canvas.addEventListener('blur', () => { instructions!.classList.add('visible'); });
        // canvas.addEventListener('focus', () => { instructions!.classList.remove('visible'); });
        canvas.focus();
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
        switch (key) {
            case 'Numpad8': return ['move', 0, -1];
            case 'Numpad9': return ['move', +1, -1];
            case 'Numpad6': return ['move', +1, 0];
            case 'Numpad3': return ['move', +1, +1];
            case 'Numpad2': return ['move', 0, +1];
            case 'Numpad1': return ['move', -1, +1];
            case 'Numpad4': return ['move', -1, 0];
            case 'Numpad7': return ['move', -1, -1];
            case 'KeyA': return ['write', 0, 0];
            case 'KeyL': return ['light', 0, 0];
            default: return undefined;
        }
    }

    private static performPlayerAction(action: [string, number, number]) {
        switch (action[0]) {
            case 'move':
                let currentPos = G.player.getCoords();
                let destPos = Coords.addCoordsToNumbers(currentPos, action[1], action[2]);
                G.player.move(destPos);
                break;
            case 'write':
                G.log.write("You pressed A.. amazing!");
                break;
            case 'light':
                if (G.playerLight.active === true) {
                    G.log.write("You wave your hand over your glowing orb...");
                    G.playerLight.active = false;
                }
                else {
                    G.log.write("You summon a glowing orb!");
                    G.playerLight.active = true;
                }

                break;
        }

        G.board.lightManager.update();
        let playerSeenCoords = G.player.computeFov();
        G.board.draw(playerSeenCoords);
    }
}
