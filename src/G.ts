import Player from "./actors/Player";
import Board from "./Board";
import LogDisplay from "./displays/LogDisplay";


export var CurrentArena: Board;
export var PlayerRef: Player;
export var GameLog: LogDisplay;

export function SetLog(log: LogDisplay) {
    GameLog = log;
}

export function SetPlayer(player: Player) {
    PlayerRef = player;
}

export function SetArena(arena: Board) {
    CurrentArena = arena;
}


