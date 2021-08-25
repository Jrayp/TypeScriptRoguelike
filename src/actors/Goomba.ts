import { Color as ColorHelper } from "rot-js";
import _Npc from "./_Npc";

export default class Goomba extends _Npc{
    name = "Goomba";
    glyph = 'g';
    fgColor = ColorHelper.fromString("orange");
    bgColor = null;
}