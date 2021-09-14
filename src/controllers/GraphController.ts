import { Graph } from 'ngraph.graph';
import { aStar, PathFinder } from 'ngraph.path';
import C from "../C";
import { Dir, Layer, PathDir } from '../Enums';
import G from "../G";
import Point from "../util/Point";

export default class GraphController {

    _boardGraph: Graph<Point, PathDir>;
    _astar: PathFinder<Point>;

    get graph() {
        return this._boardGraph;
    }

    constructor() {

        this._boardGraph = require('ngraph.graph')();

        // First we add a node for each board cell
        for (let x = 0; x < C.BOARD_WIDTH; x++) {
            for (let y = 0; y < C.BOARD_HEIGHT; y++) {
                for (let z = 0; z < C.BOARD_DEPTH; z++) {
                    let point = Point.get(x, y, z)!;
                    this._boardGraph.addNode(point.key, point);
                }
            }
        }

        // Then we add a *single* link between all neighboring nodes
        for (let x = 0; x < C.BOARD_WIDTH; x++) {
            for (let y = 0; y < C.BOARD_HEIGHT; y++) {
                for (let z = 0; z < C.BOARD_DEPTH; z++) {
                    let point = Point.get(x, y, z)!;

                    if (z == 0)
                        this._boardGraph.addLink(point.key, point.oppositePoint().key, PathDir.VERTICAL);

                    for (let neighborAndDirection of point.iterateNeighborsWithDirection()) {
                        let n = neighborAndDirection[0];
                        let d = neighborAndDirection[1];

                        if (this._boardGraph.getLink(n.key, point.key))
                            continue;

                        let pathDir: PathDir;
                        if (d == Dir.NE || d == Dir.NW || d == Dir.SE || d == Dir.SW)
                            pathDir = PathDir.DIAGONAL;
                        else
                            pathDir = PathDir.STRAIGHT;

                        this._boardGraph.addLink(point.key, n.key, pathDir);
                    }
                }
            }
        }
    }


    getPath(from: Point, to: Point) {
        return this._astar.find(to.key, from.key);
    }
}


// this._astar = aStar(this._boardGraph, {
//     distance(fromNode, toNode, link) {
//         let fromTile = G.board.tiles.getElementViaPoint(fromNode.data);
//         let toTile = G.board.tiles.getElementViaPoint(toNode.data);

//         let toTileCost: number;

//         if (toTile.name == "Wall")
//             return Number.POSITIVE_INFINITY;
//         else if (toTile.name == "Cavern Grass") {
//             toTileCost = 5;
//         }
//         else if (toTile.layer == Layer.BELOW)
//             toTileCost = 3;
//         else
//             toTileCost = 1;

//         switch (link.data) {
//             case PathDir.DIAGONAL:
//                 return toTileCost * 1.5;
//             case PathDir.VERTICAL:
//                 if (fromTile.oppositeMovementValidFromHere())
//                     return toTileCost * 5;
//                 else
//                     return Number.POSITIVE_INFINITY;
//             case PathDir.STRAIGHT:
//                 return toTileCost;
//         }
//     },
// });