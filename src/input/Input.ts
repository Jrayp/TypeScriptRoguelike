import G from "../G";
import ITargetableAction from "../interfaces/ITargetableAction";
import Point from "../util/Point";
import FireballAction from "./../actions/FireballAction";
import _Action from "./../actions/_Action";
import { InputState, Layer } from "./../Enums";

export default class Input {

    static logCanvas: HTMLElement;
    static boardCanvas: HTMLElement;
    static mouseOverCanvas: HTMLElement;
    static mouseBoardPoint: Point;
    static currentTargetedAction: ITargetableAction | undefined;

    static state = InputState.BOARD_CONTROL;

    static setInputHandlers(logCanvas: HTMLElement, boardCanvas: HTMLElement) {
        Input.logCanvas = logCanvas;
        Input.boardCanvas = boardCanvas;

        Input.logCanvas.addEventListener('mouseover', () => { Input.mouseOverCanvas = Input.logCanvas });

        Input.boardCanvas.setAttribute('tabindex', "1");
        Input.boardCanvas.addEventListener('mouseover', () => { Input.mouseOverCanvas = Input.boardCanvas; });
        Input.boardCanvas.addEventListener('mousemove', Input.handleMouseMoveOverBoard);
        Input.boardCanvas.addEventListener('click', Input.handleMouseClick);
        Input.boardCanvas.addEventListener('keydown', Input.handleKeyDown);

        Input.boardCanvas.focus();
    }

    ///////////////////////////////////////////////////////
    // Mouse
    ///////////////////////////////////////////////////////

    static handleMouseMoveOverBoard(event: MouseEvent) {
        let x = event.clientX - G.boardDisplay.rect.left;
        let y = event.clientY - G.boardDisplay.rect.top;

        let mouseTileX = Math.floor(x / G.boardDisplay.tileWidth);
        let mouseTileY = Math.floor(y / G.boardDisplay.tileHeight);

        let newPoint = Point.get(mouseTileX, mouseTileY, G.player.position!.layer);
        if (newPoint)
            Input.mouseBoardPoint = newPoint;

        switch (Input.state) {
            case InputState.BOARD_CONTROL:
                break;

            case InputState.TARGETING:
                Input.updateTargeting();
                break;

            case InputState.EFFECT_LOOP:
                break;
        }
    }

    static handleMouseClick(event: MouseEvent) {
        switch (Input.state) {
            case InputState.BOARD_CONTROL:
                break;

            case InputState.TARGETING:
                Input.performTargetedAction();
                break;

            case InputState.EFFECT_LOOP:
                G.board.effects.currentLoop.fps = 60;
                break;
        }
    }


    ///////////////////////////////////////////////////////
    // Keydown
    ///////////////////////////////////////////////////////

    static handleKeyDown(event: KeyboardEvent) {
        // if (event.altKey || event.ctrlKey || event.metaKey) return;

        let action: _Action | undefined;

        switch (Input.state) {
            case InputState.BOARD_CONTROL:
                action = Input.handleBoardControlKeyDown(event.code, event.shiftKey);
                break;
            case InputState.TARGETING:
                Input.handleTargetingKeyDown(event.code);
                break;
            case InputState.EFFECT_LOOP:
                break;
        }

        if (action) {
            event.preventDefault();
            G.handleAction(action);
        }
    }

    static handleBoardControlKeyDown(keycode: string, shift: boolean): _Action | undefined {
        switch (keycode) {
            case "KeyF":
                Input.startTargeting();
                break;
            case "Period":
                if (shift) {
                    let playerTile = G.player.tile!;
                    if (G.player.position!.layer === Layer.ABOVE && playerTile.downMovementValid)
                        return G.player.tryMove(playerTile.opposite.position);
                }
                break;
            case "Comma":
                if (shift) {
                    let playerTile = G.player.tile!;
                    if (G.player.position!.layer === Layer.BELOW && playerTile.upMovementValid)
                        return G.player.tryMove(playerTile.opposite.position);
                }
                break;
            default:
                return G.player.getAction(keycode);
        }

        return undefined;
    }

    static handleTargetingKeyDown(keycode: string): _Action | undefined {
        switch (keycode) {
            case "Escape":
                Input.endTargeting();
                Input.state = InputState.BOARD_CONTROL;
                break;
        }

        return undefined;
    }


    ///////////////////////////////////////////////////////
    // Targeting
    ///////////////////////////////////////////////////////

    static startTargeting() {
        Input.currentTargetedAction = new FireballAction();
        Input.state = InputState.TARGETING;

        Input.updateTargeting();
    }

    static updateTargeting() {
        G.board.icons.clear();
        Input.currentTargetedAction!.target(G.player.position!, Input.mouseBoardPoint);
        G.draw();
    }

    static endTargeting() {
        Input.currentTargetedAction = undefined;
        G.board.icons.clear();
        G.draw();
    }

    //TODO: Could created targetedAction class which returns an action on finuished target call
    static performTargetedAction() {
        let action = Input.currentTargetedAction!;
        this.endTargeting();
        G.handleAction(action);
    }

}