import C from "./C";

// const Direction = {
//     N : C.DIR_COORDS[0],
//     NE,
//     E,
//     SE,
//     S,
//     SW,
//     W,
//     NW
// }

export enum TryMoveResult {
    SUCCESFUL,
    ENEMY,
    FRIENDLY,
    IMPASSABLE
}