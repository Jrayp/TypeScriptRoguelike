import G from "../G";
import ITargetableAction from "../interfaces/ITargetableAction";
import FireballAction from "./../actions/FireballAction";
import _Action from "./../actions/_Action";
import { ActionState, InputState } from "./../Enums";
import Coords from "../util/Coords";

export default class Input {

    static logCanvas: HTMLElement;
    static boardCanvas: HTMLElement;
    static mouseOverCanvas: HTMLElement;
    static mouseBoardCoords: Coords;
    static currentTargetedAction: ITargetableAction | undefined;

    static state = InputState.BOARD_CONTROL;

    static setInputHandlers(logCanvas: HTMLElement, boardCanvas: HTMLElement) {
        Input.logCanvas = logCanvas;
        Input.boardCanvas = boardCanvas;

        Input.logCanvas.addEventListener('mouseover', () => { Input.mouseOverCanvas = Input.logCanvas });

        Input.boardCanvas.setAttribute('tabindex', "1");
        Input.boardCanvas.addEventListener('mouseover', () => { Input.mouseOverCanvas = Input.boardCanvas; });
        Input.boardCanvas.addEventListener('mousemove', Input.handleMouseMove);
        Input.boardCanvas.addEventListener('click', Input.handleMouseClick);
        Input.boardCanvas.addEventListener('keydown', Input.handleKeyDown);

        Input.boardCanvas.focus();
    }

    ///////////////////////////////////////////////////////
    // Mouse
    ///////////////////////////////////////////////////////

    static handleMouseMove(event: MouseEvent) {
        let x = event.clientX - G.boardDisplay.rect.left;
        let y = event.clientY - G.boardDisplay.rect.top;

        let mouseTileX = Math.floor(x / G.boardDisplay.tileWidth);
        let mouseTileY = Math.floor(y / G.boardDisplay.tileHeight);

        Input.mouseBoardCoords = new Coords(mouseTileX, mouseTileY);

        switch (Input.state) {
            case InputState.BOARD_CONTROL:
                break;

            case InputState.TARGETING:
                break;

            case InputState.EFFECT_LOOP:
                break;
        }


        if (Input.state == InputState.TARGETING) {
            G.board.icons.clear();
            Input.currentTargetedAction!.target(G.player.coords!, Input.mouseBoardCoords);
            let playerSeenCoords = G.player.computeFov();
            G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
            G.boardDisplay.drawUI();
        }
    }

    static handleMouseClick(event: MouseEvent) {
        if (Input.state == InputState.TARGETING) {
            let i = Input.currentTargetedAction!;
            Input.currentTargetedAction = undefined;
            G.board.icons.clear();
            let playerSeenCoords = G.player.computeFov();
            G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
            i.perform();
        }
    }


    ///////////////////////////////////////////////////////
    // Keydown
    ///////////////////////////////////////////////////////

    static handleKeyDown(event: KeyboardEvent) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;

        let action: _Action | undefined;

        switch (Input.state) {
            case InputState.BOARD_CONTROL:
                action = Input.handleBoardControlKeyDown(event.code);
                break;
            case InputState.TARGETING:
                Input.handleTargetingKeyDown(event.code);
                break;
            case InputState.EFFECT_LOOP:
                break;
        }

        if (action) {
            event.preventDefault();
            // TODO: Probably should pass action to something and perform there to handle logging etc
            if (action.beforeLogCallback)
                G.log.write(action.beforeLogCallback());
            action.state = ActionState.PERFORMING;
            action.state = action.perform();
            if (action.afterLogCallback)
                G.log.write(action.afterLogCallback());
            G.update();
        }
    }

    static handleBoardControlKeyDown(keycode: string): _Action | undefined {
        switch (keycode) {
            case "KeyF":
                Input.currentTargetedAction = new FireballAction();
                Input.currentTargetedAction.target(G.player.coords!, Input.mouseBoardCoords);
                
                Input.state = InputState.TARGETING;
                
                G.board.draw(G.player.seenCoords, G.player.percievedOpaqueColors);
                G.boardDisplay.drawUI();
                break;
            default:
                return G.player.getAction(keycode);
        }

        return undefined;
    }

    static handleTargetingKeyDown(keycode: string): _Action | undefined {
        switch (keycode) {
            case "Escape":
                Input.currentTargetedAction = undefined;
                G.board.icons.clear();
                let playerSeenCoords = G.player.computeFov();
                G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
                Input.state = InputState.BOARD_CONTROL;
                break;
        }

        return undefined;
    }

}