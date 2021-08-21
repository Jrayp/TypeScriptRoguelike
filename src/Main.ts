import GameDisplay from './GameDisplay';
import * as C from './C'
import ArenaMap from './ArenaMap';
import { Color } from 'rot-js';

let game = new GameDisplay();

document.body.append(game.getContainer()!);

let arena = new ArenaMap();

for (let x: number = 0; x < C.ARENA_WIDTH; x++) {
  for (let y: number = 0; y < C.ARENA_HEIGHT; y++) {
    let arenaTile = arena.map[x][y];
    game.draw(x, y, arenaTile.glyph, arenaTile.fgColor, arenaTile.bgColor);
  }
}

game.draw(15, 9, '@', Color.toRGB([90, 125, 25]), null);
