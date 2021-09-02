import _Action from "./../actions/_Action";
import { GameState } from "./../Enums";
import G from "../G";
import BoardInput from "./BoardInput";
import LogInput from "./LogInput";

export default class Input {

    // Inputs
    static boardInput: BoardInput;
    static logInput: LogInput;

    static mouseOverInput: Input;

    // Dom
    static logCanvas: HTMLElement;
    static logCanvasRect: DOMRect;

    static boardCanvas: HTMLElement;
    static boardCanvasRect: DOMRect;

    static setInputHandlers(logCanvas: HTMLElement, boardCanvas: HTMLElement) {
        Input.logCanvas = logCanvas;
        Input.boardCanvas = boardCanvas;
        Input.logCanvas.addEventListener('mouseover', () => { Input.mouseOverInput = Input.logInput });
        Input.boardCanvas.setAttribute('tabindex', "1");
        Input.boardCanvas.addEventListener('mouseover', () => { Input.mouseOverInput = Input.boardInput });
        Input.boardCanvas.addEventListener('keydown', Input.handleKeyDown);
        window.onscroll = Input.recalculateCanvasRects;
        window.onresize = Input.recalculateCanvasRects;
        Input.boardCanvas.focus();
    }

    private static recalculateCanvasRects() {
        Input.logCanvasRect = Input.logCanvas.getBoundingClientRect();
        Input.boardCanvasRect = Input.boardCanvas.getBoundingClientRect();
    }

    static handleMouseMove(event: MouseEvent) {
        // Input.mouseOverInput.handleMouseMove(event);
    }

    static handleKeyDown(event: KeyboardEvent) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;

        let action: _Action | undefined;

        switch (G.state) {
            case GameState.PLAYER_CONTROL:
                action = G.player.getAction(event.code);
                break;
            case GameState.TARGETING:
                break;
            case GameState.EFFECT_LOOP:
                break;
        }

        if (action) {
            event.preventDefault();
            action.perform();
            G.update();
        }
    }




    // setInputHandlers() {
    //     const instructions = document.getElementById('focus-instructions');
    //     G.boardCanvas.setAttribute('tabindex', "1");
    //     G.boardCanvas.addEventListener('keydown', G.handleKeyDown);
    //     G.boardCanvas.addEventListener('mousemove', G.handleMouseOver);
    //     // canvas.addEventListener('blur', () => { instructions!.classList.add('visible'); });
    //     // canvas.addEventListener('focus', () => { instructions!.classList.remove('visible'); });
    //     window.onscroll = G.recalculateOffset;
    //     window.onresize = G.recalculateOffset;
    //     G.boardCanvas.focus();
    // }





    // handleKeyDown(event: KeyboardEvent) {
    //     if (event.altKey || event.ctrlKey || event.metaKey) return;
    //     let playerAction = G.determinePlayerAction(event.code);
    //     if (playerAction != undefined) {
    //         event.preventDefault();
    //         G.performPlayerAction(playerAction);
    //     }
    // }


    // determinePlayerAction(key: string): [string, number, number] | undefined {
    //     if (G.state != GameState.PLAYER_CONTROL)
    //         return undefined;

    //     switch (key) {
    //         case 'Numpad8': return ['move', 0, -1];
    //         case 'Numpad9': return ['move', +1, -1];
    //         case 'Numpad6': return ['move', +1, 0];
    //         case 'Numpad3': return ['move', +1, +1];
    //         case 'Numpad2': return ['move', 0, +1];
    //         case 'Numpad1': return ['move', -1, +1];
    //         case 'Numpad4': return ['move', -1, 0];
    //         case 'Numpad7': return ['move', -1, -1];
    //         case 'Numpad5': return ['wait', 0, 0];
    //         case 'KeyA': return ['write', 0, 0];
    //         case 'KeyL': return ['light', 0, 0];
    //         case 'KeyC': return ['crystal', 0, 0];
    //         case 'KeyF': return ['fireball', 0, 0];
    //         case 'KeyO': return ['circle', 0, 0];
    //         default: return undefined;
    //     }
    // }

    // performPlayerAction(action: [string, number, number]) {
    //     switch (action[0]) {
    //         case 'move':
    //             let currentPos = G.player.coords!;
    //             let destPos = Coords.addCoordsToNumbers(currentPos, action[1], action[2]);
    //             let result = G.player.tryMove(destPos);
    //             switch (result) {
    //                 case TryMoveResult.SUCCESFUL:
    //                     break;
    //                 case TryMoveResult.IMPASSABLE:
    //                     break;
    //                 case TryMoveResult.ENEMY:
    //                     break;
    //             }
    //             break;
    //         case 'write':
    //             G.log.write("You pressed A.. amazing!");
    //             break;
    //         case 'wait':
    //             break;
    //         case 'circle':
    //             for (let t of G.board.tiles.iterateCircumference(G.player.coords!, 1.5)) {
    //                 G.board.tiles.replace(t[0], new RubbleTile([255, 0, 255]));
    //                 // G.board.tiles.replace(t[0], new WallTile());

    //             }
    //             break;
    //         case 'fireball':
    //             G.state = GameState.TARGETING;
    //             return;
    //         case 'crystal':
    //             let coords = G.player.coords!;
    //             let tile = G.board.tiles.getElementViaCoords(coords);
    //             if (tile.name != "Glowing Crystal")
    //                 G.board.tiles.replace(coords, new GlowingCrystalTile());
    //             break;
    //         case 'light':
    //             if (G.player.light.active === true) {
    //                 G.log.write("You wave your hand over your glowing orb...");
    //                 G.player.light.active = false;
    //             }
    //             else {
    //                 G.log.write("You summon a glowing orb!");
    //                 G.player.light.active = true;
    //             }

    //             break;
    //     }

    //     // Uh oh.. whaty about light so npc and thier vision??? 
    //     // Maybe doesnt matter they just have to see what they see before moving?
    //     G.board.actors.update();
    //     G.board.lights.update();
    //     let playerSeenCoords = G.player.computeFov();
    //     G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
    // }

}