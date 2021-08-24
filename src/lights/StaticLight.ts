// import { Color as ColorHelper, FOV, Lighting } from "rot-js";
// import { Color } from 'rot-js/lib/color';
// import C from "../C";
// import G from "../G";
// import Coords from "../util/Coords";


// // TODO: Use the method in the example: It allows us to automatically adjust tile colors all over
// // Remember, idiot

// export default class StaticLight {

//     // TODO: Should this be here? Prob not
//     static ambientLight: Color = [0, 0, 0];

//     intensity = 8;
//     color: Color = [155, 155, 155];

//     private _lightCone = new FOV.PreciseShadowcasting(this.lightPassingCallback, { topology: 8 });
//     private _lighting = new Lighting(this.reflectivityCallback, { range: this.intensity, passes: 2 })
//         .setFOV(this._lightCone);

//     constructor(x: number, y: number, color: Color = [155, 155, 155]) {
//         this.color = color;
//         this._lighting.setLight(x, y, this.color);
//     }

//     move(x: number, y: number) {
//         this._lighting.clearLights();
//         this._lighting.setLight(x, y, this.color);
//     }

//     update() {
//         this._lighting.compute(this.lightingCallback);
//     }

//     private lightingCallback(x: number, y: number, color: Color) {
//         const coords = new Coords(x, y);

//         if (G.board.lightLayer.hasCoords(coords)) {
//             let oldLight = G.board.lightLayer.getElementViaCoords(coords);
//             let newLight = ColorHelper.add(oldLight, color);
//             G.board.lightLayer.replace(coords, newLight);
//         }
//         else {
//             let newLight = ColorHelper.add(StaticLight.ambientLight, color);
//             G.board.lightLayer.set(coords, newLight);
//         }

//     }

//     private lightPassingCallback(x: number, y: number) {
//         const key = Coords.makeKey(x, y);
//         if (!G.board.numbersWithinBounds(x, y))
//             return false;
//         else
//             return G.board.tileLayer.getElementViaKey(key).transparent;
//     }

//     private reflectivityCallback(x: number, y: number) {
//         const key = Coords.makeKey(x, y);
//         if (!G.board.numbersWithinBounds(x, y) || !G.board.tileLayer.getElementViaKey(key).passable)
//             return 0;
//         else
//             return C.LIGHT_DEFAULT_REFLECTIVITY;
//     }

// }