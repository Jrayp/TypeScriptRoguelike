import BoardDisplay from './displays/BoardDisplay';

import * as G from './G'

import Board from './Board';

import Player from './actors/Player';
import LogDisplay from './displays/LogDisplay';
import Log from './Log';




function setupInputHandlers(gameDisplay: BoardDisplay) {
  const canvas = gameDisplay.getContainer();
  const instructions = document.getElementById('focus-instructions');
  canvas!.setAttribute('tabindex', "1");
  canvas!.addEventListener('keydown', handleKeyDown);
  // canvas!.addEventListener('mousemove', handleMousemove);33
  // canvas!.addEventListener('mouseout', handleMouseout);
  canvas!.addEventListener('blur', () => { instructions!.classList.add('visible'); });
  canvas!.addEventListener('focus', () => { instructions!.classList.remove('visible'); });
  canvas!.focus();
}


function draw() {
  G.CurrentArena.draw(gameDisplay);
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  // let action = currentKeyHandler()(event.key);
  let action = handlePlayerKeys(event.code);
  if (action != undefined) {
    event.preventDefault();
    runAction(action);
  }
}


// TODO: use enums
function runAction(action: [string, number, number]) {
  switch (action[0]) {
    case 'move':
      let currentPos = G.PlayerRef.getCoords();
      let xx = currentPos[0] + action[1];
      let yy = currentPos[1] + action[2];
      let newPos = Board.convert2Dto1D(xx, yy);
      G.PlayerRef.move(newPos);
  }

  draw();
}

function handlePlayerKeys(key: string): [string, number, number] | undefined {
  switch (key) {
    case 'Numpad8': return ['move', 0, -1];
    case 'Numpad9': return ['move', +1, -1];
    case 'Numpad6': return ['move', +1, 0];
    case 'Numpad3': return ['move', +1, +1];
    case 'Numpad2': return ['move', 0, +1];
    case 'Numpad1': return ['move', -1, +1];
    case 'Numpad4': return ['move', -1, 0];
    case 'Numpad7': return ['move', -1, -1];
    default: return undefined;
  }
}

let logDisplay = new LogDisplay();
document.body.append(logDisplay.getContainer()!);

let gameDisplay = new BoardDisplay();
document.body.append(gameDisplay.getContainer()!);


var log = new Log(logDisplay);
Log.Write("sdsdsdsdsd");


// G.SetLog(logDisplay);

G.SetArena(new Board());

let playerPos = -1;
for (let kvp of G.CurrentArena.tileLayer.iterator()) {
  if (kvp[0].passable) {
    playerPos = kvp[1];
    break;
  }
}
var p = new Player();
G.CurrentArena.actorLayer.set(playerPos, p);
G.SetPlayer(p);

setupInputHandlers(gameDisplay);

Log.Write("Welcome to TypeScript Roguelike!");

draw();




// print("Hello and welcome, adventurer, to yet another dungeon!", 'welcome');
// const inventoryOverlayUse = createInventoryOverlay('use');
// const inventoryOverlayDrop = createInventoryOverlay('drop');
// const targetingOverlay = createTargetingOverlay();
// const upgradeOverlay = createUpgradeOverlay();
// const characterOverlay = createCharacterOverlay();
// setupInputHandlers(display);
// draw();
