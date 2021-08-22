import Player from './actors/Player';
import Board from './Board';
import BoardDisplay from './displays/BoardDisplay';
import G from './G';
import Log from './Log';







function setupInputHandlers(gameDisplay: BoardDisplay) {
  const canvas = gameDisplay.getContainer();
  const instructions = document.getElementById('focus-instructions');
  canvas!.setAttribute('tabindex', "1");
  canvas!.addEventListener('keydown', handleKeyDown);
  // canvas!.addEventListener('mousemove',f handleMousemove);
  // canvas!.addEventListener('mouseout', handleMouseout);
  canvas!.addEventListener('blur', () => { instructions!.classList.add('visible'); });
  canvas!.addEventListener('focus', () => { instructions!.classList.remove('visible'); });
  canvas!.focus();
}


function draw() {
  G.Board.draw(G.BoardDisplay);
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
      let currentPos = G.Player.getCoords();
      let xx = currentPos[0] + action[1];
      let yy = currentPos[1] + action[2];
      let newPos = Board.convert2Dto1D(xx, yy);
      G.Player.move(newPos);
      break;
    case 'write':
      G.Log.write("Hello this is a very long piece of text, it should fill up the log lol hahahaha piece of shit");
      break;
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
    case 'KeyA': return ['write', -1, -1];
    default: return undefined;
  }
}

// let logDisplay = new LogDisplay();
document.body.append(G.LogDisplay.getContainer()!);

// let gameDisplay = new BoardDisplay();
document.body.append(G.BoardDisplay.getContainer()!);


G.Log = new Log();


// G.SetLog(logDisplay);

G.Board = new Board();

let playerPos = -1;
for (let kvp of G.Board.tileLayer.iterator()) {
  if (kvp[1].passable) {
    playerPos = kvp[0];
    break;
  }
}

G.Player = new Player();
G.Board.actorLayer.set(playerPos, G.Player);

setupInputHandlers(G.BoardDisplay);

G.Log.write("Welcome to TypeScript Roguelike!");

draw();




// print("Hello and welcome, adventurer, to yet another dungeon!", 'welcome');
// const inventoryOverlayUse = createInventoryOverlay('use');
// const inventoryOverlayDrop = createInventoryOverlay('drop');
// const targetingOverlay = createTargetingOverlay();
// const upgradeOverlay = createUpgradeOverlay();
// const characterOverlay = createCharacterOverlay();
// setupInputHandlers(display);
// draw();
