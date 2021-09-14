import Cell from "../util/Cell";
import ISight from "../interfaces/ISight";
import G from "./../G";

export default class SightHelper {

    static computeFovNpc(sight: ISight) {
        // const sightImplmenterCell = sight.position;
        // sight.seenCells.clear();
        // if (sightImplmenterCell) {
        //     sight.fovAlgorithm.compute(sightImplmenterCell.x, sightImplmenterCell.y, sight.sightRange,
        //         (x: number, y: number, r: number, visibility: number) => {
        //             let cell = Cell.get(x, y, sight.position!.layer)!;
        //             if (G.board.tiles.getElementViaCell(cell).transparent && G.board.lights.getBrightness(cell))
        //                 sight.seenCells.add(cell); // Npc's only care about seeing transparent tiles
        //         });
        //     sight.seenCells.add(sightImplmenterCell); // Always see own Cell
        // }
        return sight.seenCells;
    }

    // sightPassesCallback = (x: number, y: number) => {
    //     let cell = Cell.get(x, y, this.position!.layer);
    //     if (cell) {
    //         return G.board.tiles.getElementViaCell(cell).transparent;
    //     }
    //     else {
    //         return false;
    //     }
    // }

}