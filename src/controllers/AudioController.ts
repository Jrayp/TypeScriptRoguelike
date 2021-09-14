import G from "./../G";
import C from "./../C";
import Cell from "../util/Cell";
import { aStar, PathFinder } from 'ngraph.path';
import createGraph, { Graph } from 'ngraph.graph';
import { Howl, Howler } from "howler";
import GMath from "./../util/GMath";
import Sound from "./../audio/Sound";

export default class AudioController {

    // private _muffleGrid: number[][][];

    muffleGraph: Graph<Cell, number>;
    astar: PathFinder<Cell>;

    sounds: Set<Sound> = new Set<Sound>();

    constructor() {
        this.muffleGraph = require('ngraph.graph')();
        for (let x = 0; x < C.BOARD_WIDTH; x++) {
            for (let y = 0; y < C.BOARD_HEIGHT; y++) {
                for (let z = 0; z < C.BOARD_DEPTH; z++) {
                    let cell = Cell.get(x, y, z)!;
                    this.muffleGraph.addNode(cell.key, cell);
                    for (let n of cell.iterateNeighbors())
                        if (n) {
                            // TODO: Doesnt account for layers
                            this.muffleGraph.addLink(cell.key, n.key);
                        }
                }
            }
        }
        this.astar = aStar(this.muffleGraph, {
            distance(fromNode, toNode, link) {
                let tile = G.board.tiles.getElementViaCell(toNode.data);
                return tile.name == "Wall" ? 8 : 1;
            },

        });
    }

    update() {
        for (let s of this.sounds) {
            this.configSound(s);
        }
    }

    configSound(sound: Sound) {
        let path = this.astar.find(G.player.position!.key, sound.position!.key);
        let length = GMath.clamp(path.length - 1, 0, 12);
        let muffle = 0;
        console.log("---");
        for (let p of path) {
            if (p.data == G.player.position!)
                continue;
            console.log(p.data.toString());
            muffle += G.board.tiles.getElementViaCell(p.data)!.name == "Wall" ? 16 : 1;
        }
        console.log("Length: " + length.toString());
        console.log("Muffle: " + muffle.toString());
        let n = GMath.normalize(muffle, 0, 12 * 2, 0, 1);
        sound.sound.volume(1 - n);
        sound.sound.rate(1 - n);
        Howler.pos(G.player.position!.x, G.player.position!.y, 0);
    }

}