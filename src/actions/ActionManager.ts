import { GameState } from "./../Enums";
import G from "./../G";
import _Action from "./_Action";

// TODO consider just extending the actor layer (maybe not)
export default class ActionManager {

    fps = 12;
    changeEvery = 1000 / this.fps;
    elapsed = this.changeEvery;
    start: number | null;

    removeAction(action: _Action) {
        G.board.actionLayer.removeViaElement(action);
    }

    getAction(key: string) {
        return G.board.actionLayer.getElementViaKey(key);
    }

    startLoop() {
        G.state = GameState.ACTION;
        this.start = null;
        this.elapsed = this.changeEvery;
        requestAnimationFrame(this.loop);
    }

    finalize() {
        G.board.npcManager.update();
        G.board.lightManager.update();
        let playerSeenCoords = G.player.computeFov();
        G.board.draw(playerSeenCoords);
        G.state = GameState.PLAYER_CONTROL;
    }

    updateAndDraw(dt: any) {
        this.elapsed += dt;
        if (this.elapsed > this.changeEvery) {
            this.elapsed = 0;
            // index = (index + 1) % 3;

            for (let coordsAndAction of G.board.actionLayer.iterateElements()) {
                const coords = coordsAndAction[1];
                const action = coordsAndAction[0];
                action.doStep();
            }
            G.board.lightManager.update();
            let seenCells = G.player.computeFov();
            G.board.draw(seenCells);
        }
    }

    loop = (timestamp: any) => {
        if (!this.start)
            this.start = timestamp;
        let dt = timestamp - this.start!;
        this.start = timestamp;
        this.updateAndDraw(dt);
        if (G.board.actionLayer.count() > 0)
            requestAnimationFrame(this.loop);
        else
            this.finalize();
    }

}




// const fps = 6;
// const changeEvery = 1000 / fps;
// let elapsed = changeEvery;
// let index = 0;

// const render = (dt: any) => {
//     elapsed += dt;
//     if (elapsed > changeEvery) {
//         elapsed = 0;
//         index = (index + 1) % 3;

//         console.log("Frame");
//     }
// }


// let start: number | null;
// let loop = (timestamp: any) => {
//     if (!start) start = timestamp;
//     let dt = timestamp - start!;
//     start = timestamp;
//     render(dt);

//     requestAnimationFrame(loop);
// }

// requestAnimationFrame(loop);