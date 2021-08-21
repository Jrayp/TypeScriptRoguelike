import { Color } from 'rot-js';

export class ArenaTile {

    // TODO: Store these tiletypes as objects and just pass to constructor?

    static newFloor() { return new ArenaTile("Floor", '.', Color.toRGB([100, 100, 100]), null, true) }
    static newWall() { return new ArenaTile("Wall", ' ', null, Color.toRGB([25, 50, 75]), false) }
    static newWater() { return new ArenaTile("Water", '~', Color.toRGB([25, 100, 225]), null, true) }

    constructor(readonly name: string,
        readonly glyph: string,
        readonly fgColor: string | null,
        readonly bgColor: string | null,
        readonly passable: boolean) {
    }
}