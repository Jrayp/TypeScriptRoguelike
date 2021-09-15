import { Graph } from "ngraph.graph";
import { PathDir } from "./../Enums";
const makeSearchStatePool = require('./../../node_modules/ngraph.path/a-star/makeSearchStatePool');
const NodeHeap = require('./../../node_modules/ngraph.path/a-star/NodeHeap.js');
import Cell from "./Cell";
import { assertTrue } from "./Assertions";
const defaultSettings = require('./../../node_modules/ngraph.path/a-star/defaultSettings.js');


// This is extracted from ngraph.graphs aStar implementation

export default class Bfs {

  private _graph: Graph<Cell>;
  private _distanceCallback = (fromCell: Cell, ToCell: Cell, linkData: PathDir) => {
    return 1;
  }

  private _searchStatePool = makeSearchStatePool();
  private _nodeState = new Map();
  private _openSet: any;
  private _cameFrom: any;

  constructor(graph: Graph<Cell>, distanceCallback?: (fromCell: Cell, ToCell: Cell, linkData: PathDir) => number) {
    this._graph = graph;
    if (distanceCallback)
      this._distanceCallback = distanceCallback;
  }

  computeForDistance(startCell: Cell, maxDistance: number) : Map<Cell, number> {
    let from = this._graph.getNode(startCell.key);
    assertTrue(from, 'Cell is not defined in this graph: ' + startCell.toString())

    this._searchStatePool.reset();
    this._nodeState.clear();

    this._openSet = new NodeHeap({
      compare: defaultSettings.compareFScore,
      setNodeId: defaultSettings.setHeapIndex
    });

    var startNode = this._searchStatePool.createNewState(from);
    this._nodeState.set(from.id, startNode);

    startNode.fScore = 0;
    startNode.distanceToSource = 0;
    this._openSet.push(startNode);
    startNode.open = 1;

    while (this._openSet.length > 0) {
      this._cameFrom = this._openSet.pop();
      this._cameFrom.closed = true;

      // Early Stop Condition
      if (this._cameFrom.distanceToSource > maxDistance) {
        this._nodeState.delete(this._cameFrom.node.id);
        continue;
      }

      this._graph.forEachLinkedNode(this._cameFrom.node.id, this.visitNeighbour.bind(this), false);
    }

    // For now we just move the data over. 
    // Could do this in real time as well
    let result = new Map<Cell, number>();
    for (let resultState of this._nodeState) {
      result.set(resultState[1].node.data, resultState[1].distanceToSource);
    }
    return result;
  }

  visitNeighbour(otherNode: any, link: any) {
    var otherSearchState = this._nodeState.get(otherNode.id);
    if (!otherSearchState) {
      otherSearchState = this._searchStatePool.createNewState(otherNode);
      this._nodeState.set(otherNode.id, otherSearchState);
    }

    if (otherSearchState.closed) {
      // Already processed this node.
      return;
    }

    if (otherSearchState.open === 0) {
      // Remember this node.
      this._openSet.push(otherSearchState);
      otherSearchState.open = 1;
    }

    var tentativeDistance = this._cameFrom.distanceToSource + this._distanceCallback(this._cameFrom.node.data, otherNode.data, link.data);
    if (tentativeDistance >= otherSearchState.distanceToSource) {
      // This would only make our path longer. Ignore this route.
      return;
    }

    // bingo! we found shorter path:
    otherSearchState.parent = this._cameFrom;
    otherSearchState.distanceToSource = tentativeDistance;
    otherSearchState.fScore = tentativeDistance;

    this._openSet.updateItem(otherSearchState.heapIndex);
  }

}
