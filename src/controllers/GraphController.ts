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

    }

    init() {
        this._boardGraph = require('ngraph.graph')();
        for (let x = 0; x < C.BOARD_WIDTH; x++) {
            for (let y = 0; y < C.BOARD_HEIGHT; y++) {
                for (let z = 0; z < C.BOARD_DEPTH; z++) {
                    let point = Point.get(x, y, z)!;
                    this._boardGraph.addNode(point.key, point);
                }
            }
        }


        for (let x = 0; x < C.BOARD_WIDTH; x++) {
            for (let y = 0; y < C.BOARD_HEIGHT; y++) {
                for (let z = 0; z < C.BOARD_DEPTH; z++) {
                    let point = Point.get(x, y, z)!;

                    if (z == 0)
                        this._boardGraph.addLink(point.key, point.oppositePoint().key, PathDir.VERTICAL);

                    for (let nd of point.iterateNeighborsWithDirection()) {
                        if (this._boardGraph.getLink(nd[0].key, point.key))
                            continue;

                        let pathDir: PathDir;
                        if (nd[1] == Dir.NE || nd[1] == Dir.NW || nd[1] == Dir.SE || nd[1] == Dir.SW)
                            pathDir = PathDir.DIAGONAL;
                        else
                            pathDir = PathDir.STRAIGHT;

                        this._boardGraph.addLink(point.key, nd[0].key, pathDir);
                    }
                }
            }
        }
        console.log(this._boardGraph.getLinkCount());

        this._astar = aStar(this._boardGraph, {
            distance(fromNode, toNode, link) {
                let fromTile = G.board.tiles.getElementViaPoint(fromNode.data);
                let toTile = G.board.tiles.getElementViaPoint(toNode.data);

                let toTileCost: number;

                if (toTile.name == "Wall")
                    return Number.POSITIVE_INFINITY;
                else if (toTile.name == "Cavern Grass") {
                    toTileCost = 5;
                }
                else if (toTile.layer == Layer.BELOW)
                    toTileCost = 3;
                else
                    toTileCost = 1;

                switch (link.data) {
                    case PathDir.DIAGONAL:
                        return toTileCost * 1.5;
                    case PathDir.VERTICAL:
                        if (fromTile.oppositeMovementValidFromHere())
                            return toTileCost * 5;
                        else
                            return Number.POSITIVE_INFINITY;
                    case PathDir.STRAIGHT:
                        return toTileCost;
                }
            },
            // heuristic(fromNode, toNode) {
            //     let dx = fromNode.data.x - toNode.data.x;
            //     let dy = fromNode.data.y - toNode.data.y;

            //     return Math.max(Math.abs(dx), Math.abs(dy));
            // }
        });
    }



    getPath(from: Point, to: Point) {
        return this._astar.find(to.key, from.key);
    }
}