import G from "../G";
import ITargetableAction from "../interfaces/ITargetableAction";
import Cell from "../util/Cell";
import { ActionState, InputState, Layer } from "./../Enums";
import DebugAction from "./../actions/DebugAction";
import FireballAction from "./../actions/FireballAction";
import _Action from "./../actions/_Action";
import { Icon } from "./../controllers/UIController";
import BoardDisplay from "./../displays/BoardDisplay";
import LogDisplay from "./../displays/LogDisplay";
import Bfs from "./../util/Bfs";


export default class Input {

    private static _logDisplay: LogDisplay;
    private static _boardDisplay: BoardDisplay;

    private static _logCanvas: HTMLElement;
    private static _boardCanvas: HTMLElement;
    private static _mouseOverCanvas: HTMLElement;

    private static _mouseBoardCell: Cell;

    private static _currentTargetedAction: ITargetableAction | undefined;

    private static _state = InputState.BOARD_CONTROL;

    static SetState(state: InputState) {
        Input._state = state;
    }

    static init(logDisplay: LogDisplay, boardDisplay: BoardDisplay) {
        Input._logDisplay = logDisplay;
        Input._boardDisplay = boardDisplay;
        Input.setInputHandlers(logDisplay.getContainer()!, boardDisplay.getContainer()!)
    }

    static setInputHandlers(logCanvas: HTMLElement, boardCanvas: HTMLElement) {
        Input._logCanvas = logCanvas;
        Input._boardCanvas = boardCanvas;

        Input._logCanvas.addEventListener('mouseover', () => { Input._mouseOverCanvas = Input._logCanvas });

        Input._boardCanvas.setAttribute('tabindex', "1");
        Input._boardCanvas.addEventListener('mouseover', () => { Input._mouseOverCanvas = Input._boardCanvas; });
        Input._boardCanvas.addEventListener('mousemove', Input.handleMouseMoveOverBoard);
        Input._boardCanvas.addEventListener('click', Input.handleMouseClick);
        Input._boardCanvas.addEventListener('keydown', Input.handleKeyDown);

        Input._boardCanvas.focus();
    }

    ///////////////////////////////////////////////////////
    // Mouse
    ///////////////////////////////////////////////////////

    static handleMouseMoveOverBoard(event: MouseEvent) {
        // Pizzicato.context.resume();

        let x = event.clientX - Input._boardDisplay.rect.left;
        let y = event.clientY - Input._boardDisplay.rect.top;

        let mouseTileX = Math.floor(x / Input._boardDisplay.tileWidth);
        let mouseTileY = Math.floor(y / Input._boardDisplay.tileHeight);

        let newCell = Cell.get(mouseTileX, mouseTileY, G.player.position!.layer);
        if (newCell)
            Input._mouseBoardCell = newCell;

        switch (Input._state) {
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
        switch (Input._state) {
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
        let action: _Action | undefined;

        switch (Input._state) {
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
            case "KeyP":
                return new DebugAction(() => {
                    G.board.icons.clear();
                    let start = G.player.soundPos;
                    let end = G.player.position!;
                    let bfs = new Bfs(G.board.graph.fetch, (fromCell, toCell, linkData) => {
                        let layer = G.board.tiles.getElementViaCell(toCell).layer;
                        let name = G.board.tiles.getElementViaCell(toCell).name;

                        if (layer == 1)
                            return Number.POSITIVE_INFINITY;

                        if (name == "Wall")
                            return 15;
                        else return 1;
                    });
                    let maxd = 18;
                    let result = bfs.computeForDistance(start, maxd)

                    console.log(result.size);

                    if (result)
                        for (let p of result) {
                            if (p[0] == start)
                                G.board.icons.addIcon(p[0], new Icon("x", null, [255, 0, 0]))
                            else if (p[0].layer != 1) {
                                let glyph = G.board.tiles.getElementViaCell(p[0]).glyph;
                                let fg = G.board.tiles.getElementViaCell(p[0]).fgColor;
                                G.board.icons.addIcon(p[0], new Icon(glyph, fg, [255 - p[1] * 12, p[1] * 6, p[1] * 12]));
                            }
                        }


                    return ActionState.SUCCESSFUL;

                }).logAfter('Path created.');
            case "Period":
                if (shift) {
                    let playerTile = G.player.tile!;
                    if (G.player.position!.layer === Layer.ABOVE && playerTile.downMovementValidFromHere())
                        return G.player.tryMove(playerTile.opposite().position);
                }
                break;
            case "Comma":
                if (shift) {
                    let playerTile = G.player.tile!;
                    if (G.player.position!.layer === Layer.BELOW && playerTile.upMovementValidFromHere())
                        return G.player.tryMove(playerTile.opposite().position);
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
                Input._state = InputState.BOARD_CONTROL;
                break;
        }

        return undefined;
    }


    ///////////////////////////////////////////////////////
    // Targeting
    ///////////////////////////////////////////////////////

    static startTargeting() {
        Input._currentTargetedAction = new FireballAction();
        Input._state = InputState.TARGETING;

        Input.updateTargeting();
    }

    static updateTargeting() {
        G.board.icons.clear();
        Input._currentTargetedAction!.target(G.player.position!, Input._mouseBoardCell);
        G.drawBoard();
    }

    static endTargeting() {
        Input._currentTargetedAction = undefined;
        G.board.icons.clear();
        G.drawBoard();
    }

    //TODO: Could created targetedAction class which returns an action on finuished target call
    static performTargetedAction() {
        let action = Input._currentTargetedAction!;
        this.endTargeting();
        G.handleAction(action);
    }

}