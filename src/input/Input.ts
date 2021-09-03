import G from "../G";
import FireballAction from "./../actions/FireballAction";
import _Action from "./../actions/_Action";
import { ActionState, GameState } from "./../Enums";
import ITargetable from "./../interfaces/ITargetable";
import Coords from "./../util/Coords";

export default class Input {

    static mouseOverCanvas: HTMLElement;

    static mouseTileX: number = 0;
    static mouseTileY: number = 0;

    static mouseTileCoords: Coords;

    // Dom
    static logCanvas: HTMLElement;
    static logCanvasRect: DOMRect;

    static boardCanvas: HTMLElement;
    static boardCanvasRect: DOMRect;

    static currentTargetedAction: (ITargetable & _Action) | undefined;

    static setInputHandlers(logCanvas: HTMLElement, boardCanvas: HTMLElement) {
        this.logCanvas = logCanvas;
        this.boardCanvas = boardCanvas;

        this.recalculateCanvasRects();

        this.logCanvas.addEventListener('mouseover', () => { this.mouseOverCanvas = this.logCanvas });

        this.boardCanvas.setAttribute('tabindex', "1");
        this.boardCanvas.addEventListener('mouseover', () => { this.mouseOverCanvas = this.boardCanvas; });
        this.boardCanvas.addEventListener('mousemove', this.handleMouseMove);
        this.boardCanvas.addEventListener('click', this.handleMouseClick);
        this.boardCanvas.addEventListener('keydown', this.handleKeyDown);

        window.onscroll = this.recalculateCanvasRects;
        window.onresize = this.recalculateCanvasRects;

        this.boardCanvas.focus();
    }
    static handleMouseClick(event: MouseEvent) {
        if (G.state == GameState.TARGETING) {
            let i =  Input.currentTargetedAction!;
            Input.currentTargetedAction = undefined;
            G.board.icons.clear();
            let playerSeenCoords = G.player.computeFov();
            G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
            i.perform();
        }
    }

    private static recalculateCanvasRects() {
        Input.logCanvasRect = Input.logCanvas.getBoundingClientRect();
        Input.boardCanvasRect = Input.boardCanvas.getBoundingClientRect();
    }

    static handleMouseMove(event: MouseEvent) {
        let x = event.clientX - Input.boardCanvasRect.left;
        let y = event.clientY - Input.boardCanvasRect.top;

        Input.mouseTileX = Math.floor(x / G.tileWidth);
        Input.mouseTileY = Math.floor(y / G.tileHeight);

        Input.mouseTileCoords = new Coords(Input.mouseTileX, Input.mouseTileY);


        if (G.state == GameState.TARGETING) {
            G.board.icons.clear();
            Input.currentTargetedAction!.setTargetingIcons(G.player.coords!, Input.mouseTileCoords);
            let playerSeenCoords = G.player.computeFov();
            G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
            G.boardDisplay.drawUI();
        }
    }

    static handleKeyDown(event: KeyboardEvent) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;

        let action: _Action | undefined;

        switch (G.state) {
            case GameState.PLAYER_CONTROL:
                switch (event.code) {
                    case "KeyF":
                        Input.currentTargetedAction = new FireballAction();
                        G.state = GameState.TARGETING;
                        Input.currentTargetedAction.setTargetingIcons(G.player.coords!, Input.mouseTileCoords);
                        let playerSeenCoords = G.player.computeFov();
                        G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
                        G.boardDisplay.drawUI();
                        break;
                    default:
                        action = G.player.getAction(event.code);
                }

                break;
            case GameState.TARGETING:
                switch (event.code) {
                    case "Escape":
                        Input.currentTargetedAction = undefined;
                        G.board.icons.clear();
                        let playerSeenCoords = G.player.computeFov();
                        G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
                        G.state = GameState.PLAYER_CONTROL;
                        break;
                }
                break;
            case GameState.EFFECT_LOOP:
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