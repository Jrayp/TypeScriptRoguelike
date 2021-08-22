import { FOV } from 'rot-js';
import Player from './actors/Player';
import Board from './Board';
import BoardDisplay from './displays/BoardDisplay';
import G from './G';
import Log from './Log';
import Coords from './util/Coords';




G.init();


// function setupInputHandlers(gameDisplay: BoardDisplay) {
//   const canvas = gameDisplay.getContainer();
//   const instructions = document.getElementById('focus-instructions');
//   canvas!.setAttribute('tabindex', "1");
//   canvas!.addEventListener('keydown', handleKeyDown);
//   // canvas!.addEventListener('mousemove',f handleMousemove);
//   // canvas!.addEventListener('mouseout', handleMouseout);
//   canvas!.addEventListener('blur', () => { instructions!.classList.add('visible'); });
//   canvas!.addEventListener('focus', () => { instructions!.classList.remove('visible'); });
//   canvas!.focus();
// }


function draw(seenCoords: Set<string>) {
  G.board.draw(seenCoords);
}

// function handleKeyDown(event: KeyboardEvent) {
//   if (event.altKey || event.ctrlKey || event.metaKey) return;
//   // let action = currentKeyHandler()(event.key);
//   let action = handlePlayerKeys(event.code);

//   if (action != undefined) {
//     event.preventDefault();
//     runAction(action);
//   }
// }


// // TODO: use enums
// function runAction(action: [string, number, number]) {
//   switch (action[0]) {
//     case 'move':
//       let currentPos = G.player.getCoords();
//       let destPos = Coords.addCoordsToNumbers(currentPos, action[1], action[2]);
//       G.player.move(destPos);
//       break;
//     case 'write':
//       G.log.write("You pressed A.. amazing!");
//       break;
//   }

//   draw(handleFov());
// }

// function handlePlayerKeys(key: string): [string, number, number] | undefined {
//   switch (key) {
//     case 'Numpad8': return ['move', 0, -1];
//     case 'Numpad9': return ['move', +1, -1];
//     case 'Numpad6': return ['move', +1, 0];
//     case 'Numpad3': return ['move', +1, +1];
//     case 'Numpad2': return ['move', 0, +1];
//     case 'Numpad1': return ['move', -1, +1];
//     case 'Numpad4': return ['move', -1, 0];
//     case 'Numpad7': return ['move', -1, -1];
//     case 'KeyA': return ['write', -1, -1];
//     default: return undefined;
//   }
// }

// // let logDisplay = new LogDisplay();
// document.body.append(G.LogDisplay.getContainer()!);

// // let gameDisplay = new BoardDisplay();
// document.body.append(G.boardDisplay.getContainer()!);


// G.log = new Log();


// G.SetLog(logDisplay);

// G.board = new Board();

// let playerPos: Coords = new Coords(-1, -1);
// for (let kvp of G.board.tileLayer.iterator()) {
//   if (kvp[0].name === "Floor") {
//     playerPos = kvp[1];
//     break;
//   }
// }

// G.player = new Player();
// G.board.actorLayer.set(playerPos, G.player);

// setupInputHandlers(G.boardDisplay);

// G.log.write("Welcome to TypeScript Roguelike!");

var fov = new FOV.PreciseShadowcasting(lightPasses);

draw(handleFov());

// TODO: Seen layer??
function handleFov() {
  const playerCoords = G.player.getCoords();

  let seenCells: Set<string> = new Set();
  fov.compute(playerCoords.x, playerCoords.y, 10, function (x: number, y: number, r: number, visibility: number) {
    seenCells.add(new Coords(x, y).key);
  });

  return seenCells;
}


/* input callback */
function lightPasses(x: number, y: number) {
  let coords = new Coords(x, y);
  if (!coords.withinBounds()) return false;
  let tile = G.board.tileLayer.getElementViaCoords(coords);
  return tile.transparent;
}


