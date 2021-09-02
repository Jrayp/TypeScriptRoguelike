import G from "./../G";
import Input from "./Input";

export default class BoardInput extends Input {

    static mouseTileX: number = 0;
    static mouseTileY: number = 0;

    handleMouseMove(event: MouseEvent) {
        let x = event.clientX - Input.boardCanvasRect.left;
        let y = event.clientY - Input.boardCanvasRect.top;

        BoardInput.mouseTileX = Math.floor(x / G.tileWidth);
        BoardInput.mouseTileY = Math.floor(y / G.tileHeight);

        // switch (G.state) {
        //     case GameState.TARGETING:
        //         G.board.icons.clear();
        //         let playerSeenCoords = G.player.computeFov();
        //         G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
        //         let endCoords = new Coords(G.tileX, G.tileY);
        //         G.currentTargetable.setTargetingIcons(G.player.coords!, endCoords);
        //         G.boardDisplay.drawUI();
        //         break;
        // }
    }

}