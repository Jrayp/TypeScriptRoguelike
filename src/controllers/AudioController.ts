import GMath from "./../util/GMath";
import Sound from "./../audio/Sound";
import G from "./../G";
import Bfs from "./../util/Bfs";
import { Howler } from "howler";

export default class AudioController {

    private _sounds: Set<Sound> = new Set<Sound>();
    private _bfs: Bfs;

    init() {

        this._bfs = new Bfs(G.board.graph.fetch, (fromCell, toCell, linkData) => {
            let layer = G.board.tiles.getElementViaCell(toCell).layer;
            let name = G.board.tiles.getElementViaCell(toCell).name;

            if (layer == 1)
                return Number.POSITIVE_INFINITY;

            if (name == "Wall")
                return 15;
            else return 1;
        });
    }

    update() {
        // Howler.pos(G.player.position!.x, G.player.position!.y, 0);
        for (let s of this._sounds) {
            this.configSound(s);
        }
    }

    remove(sound: Sound) {
        this._sounds.delete(sound);
    }


    add(sound: Sound) {
        this._sounds.add(sound);
    }

    configSound(sound: Sound) {
        let maxDb = 100;

        let i1 = 18;


        let soundMap = this._bfs.computeForDistance(sound.position!, sound.intensity);

        if (!soundMap.has(G.player.position!)) {
            sound.soundEffect.volume = 0;
            return;
        }

        let bfsDistanceToPlayer: number = soundMap.get(G.player.position!)!;
        let diagonalDistanceToPlayer = GMath.diagonalDistance(G.player.position!, sound.position!);

        // let i2 = GMath.clamp(dAtPlayer, 1, 18);

        let distanceNormal = GMath.normalize(bfsDistanceToPlayer, 0, sound.intensity + 1, 0, .75);

        let xDistance = GMath.clamp(sound.position!.x - G.player.position!.x, -10, 10);
        let xDistanceNormal = GMath.normalize(xDistance, -10, 10, -.5, .5);

        let ratio = diagonalDistanceToPlayer / bfsDistanceToPlayer;
        let muffle = 22050 * ratio;


        console.log("------------------");
        console.log(bfsDistanceToPlayer);
        console.log(diagonalDistanceToPlayer);
        console.log(ratio);




        sound.soundEffect.volume = .75 - distanceNormal;
        sound.lowPassFilter.frequency = muffle;
        sound.stereoPanner.pan = xDistanceNormal;

    }

}