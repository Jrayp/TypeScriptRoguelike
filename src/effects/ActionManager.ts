// import { GameState } from "../Enums";
// import G from "../G";
// import _Effect from "./_Effect";

// // TODO consider just extending the actor layer (maybe not)
// export default class ActionManager {

//     fps = 18;
//     changeEvery = 1000 / this.fps;
//     elapsed = this.changeEvery;
//     start: number | null;

//     removeAction(action: _Effect) {
//         G.board.actions.removeViaElement(action);
//     }

//     getAction(key: string) {
//         return G.board.actions.getElementViaKey(key);
//     }

//     startLoop() {
//         G.state = GameState.ACTION;
//         this.start = null;
//         this.elapsed = this.changeEvery;
//         requestAnimationFrame(this.loop);
//     }

//     finalize() {
//         G.board.actors.update();
//         G.board.lightManager.update();
//         let playerSeenCoords = G.player.computeFov();
//         G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
//         G.state = GameState.PLAYER_CONTROL;
//     }

//     updateAndDraw(dt: any) {
//         this.elapsed += dt;
//         if (this.elapsed > this.changeEvery) {
//             this.elapsed = 0;
//             // index = (index + 1) % 3;

//             for (let coordsAndAction of G.board.actions.iterateElements()) {
//                 const coords = coordsAndAction[1];
//                 const action = coordsAndAction[0];
//                 action.doStep();
//             }
//             G.board.lightManager.update();
//             let seenCells = G.player.computeFov();
//             G.board.draw(seenCells, G.player.percievedOpaqueColors);
//         }
//     }

//     loop = (timestamp: any) => {
//         if (!this.start)
//             this.start = timestamp;
//         let dt = timestamp - this.start!;
//         this.start = timestamp;
//         this.updateAndDraw(dt);
//         if (G.board.actions.count() > 0)
//             requestAnimationFrame(this.loop);
//         else
//             this.finalize();
//     }

// }




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