import { _BoardTile } from "../boardTiles/_BoardTile";

export default interface IDiggable {
    digStrength: number;

    dig() : void;
}

export function isDiggable(tile: _BoardTile | IDiggable): tile is IDiggable {
    return 'dig' in tile;
}