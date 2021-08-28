import Coords from "./Coords";

export default class GMath {

    static readonly DIR_COORDS = [
        new Coords(0, -1),
        new Coords(1, -1),
        new Coords(1, 0),
        new Coords(1, 1),
        new Coords(0, 1),
        new Coords(-1, 1),
        new Coords(-1, 0),
        new Coords(-1, -1),
    ]

    static normalize(x: number, minX: number, maxX: number, betweenA: number = 0, betweenB: number = 1) {
        return (betweenB - betweenA) * (x - minX) / (maxX - minX) + betweenA;
    };


    static clamp(x: number, min: number, max: number) {
        return Math.min(Math.max(x, min), max);
    };
}