import { PathFinder } from "ngraph.path";
import Cell from "./../util/Cell";
import Sound from "./../audio/Sound";
import { runInThisContext } from "vm";

export default class AudioController {

    private _sounds: Set<Sound> = new Set<Sound>();
    private _aStar: PathFinder<Cell>;

    init() {
        
    }

    update() {
        for (let s of this._sounds) {
            this.configSound(s);
        }
    }

    applySound(){
        // this._aStar.
    }


    configSound(sound: Sound) {
        // let path = this._aStar.find(G.player.position!.key, sound.position!.key);
        // let length = GMath.clamp(path.length - 1, 0, 12);
        // let muffle = 0;
        // console.log("---");
        // for (let p of path) {
        //     if (p.data == G.player.position!)
        //         continue;
        //     console.log(p.data.toString());
        //     muffle += G.board.tiles.getElementViaCell(p.data)!.name == "Wall" ? 16 : 1;
        // }
        // console.log("Length: " + length.toString());
        // console.log("Muffle: " + muffle.toString());
        // let n = GMath.normalize(muffle, 0, 12 * 2, 0, 1);
        // sound.sound.volume(1 - n);
        // sound.sound.rate(1 - n);
        // Howler.pos(G.player.position!.x, G.player.position!.y, 0);
    }

}