import _Action from "./../actions/_Action";
import { ActionState, GameState } from "./../Enums";
import G from "../G";

export default class Input {

    static mouseOverCanvas: HTMLElement;

    // Dom
    static logCanvas: HTMLElement;
    static logCanvasRect: DOMRect;

    static boardCanvas: HTMLElement;
    static boardCanvasRect: DOMRect;

    static setInputHandlers(logCanvas: HTMLElement, boardCanvas: HTMLElement) {
        Input.logCanvas = logCanvas;
        Input.boardCanvas = boardCanvas;

        Input.logCanvas.addEventListener('mouseover', () => { Input.mouseOverCanvas = Input.logCanvas });

        Input.boardCanvas.setAttribute('tabindex', "1");
        Input.boardCanvas.addEventListener('mouseover', () => { Input.mouseOverCanvas = Input.boardCanvas });
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