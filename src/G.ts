import Player from "./actors/Player";
import ArenaMap from "./ArenaMap";
import LogDisplay from "./LogDisplay";


export var CurrentArena: ArenaMap;
export var PlayerRef: Player;
export var GameLog: LogDisplay;

export function SetLog(log: LogDisplay) {
    GameLog = log;
}

export function SetPlayer(player: Player) {
    PlayerRef = player;
}

export function SetArena(arena: ArenaMap) {
    CurrentArena = arena;
}


