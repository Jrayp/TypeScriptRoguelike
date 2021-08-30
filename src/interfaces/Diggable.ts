import { _BoardTile } from "./../boardTiles/_BoardTile";

export default interface Diggable {
    digStrength: number;

    dig() : void;
}

export function isDiggable(tile: _BoardTile | Diggable): tile is Diggable {
    return 'dig' in tile;
}