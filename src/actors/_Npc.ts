import { FOV, RNG } from 'rot-js';
import { Color } from 'rot-js/lib/color';
import G from "../G";
import Coords from "./../util/Coords";
import _Actor from "./_Actor";

export default abstract class _Npc extends _Actor {
    name: string;
    glyph: string;
    fgColor: Color | null;
    bgColor: Color | null;


    act(){};

}