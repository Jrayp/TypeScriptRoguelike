// import { Graph } from "ngraph.graph";
// import { PathDir } from "./../Enums";
// import makeSearchStatePool from './../../node_modules/ngraph.path/a-star/makeSearchStatePool';
// import NodeHeap from './../../node_modules/ngraph.path/a-star/NodeHeap.js';
// import Cell from "./Cell";
// import { assertTrue } from "./Assertions";
// import defaultSettings from './../../node_modules/ngraph.path/a-star/defaultSettings.js';


// export default class Bfs {

//   graph: Graph<Cell>;
//   pool = makeSearchStatePool();
//   distanceCallback = (fromCell: Cell, ToCell: Cell, linkData: PathDir) => {
//     return 1;
//   }
//   nodeState = new Map();
//   openSet: NodeHeap;
//   cameFrom: any;

//   constructor(graph: Graph<Cell>) {
//     this.graph = graph;
//   }

//   computeForDistance(startCell: Cell, maxDistance: number, distanceCallback: (fromCell: Cell, ToCell: Cell, linkData: PathDir) => number = this.distanceCallback) {
//     let from = this.graph.getNode(startCell.key);
//     assertTrue(from, 'Cell is not defined in this graph: ' + startCell.toString())

//     this.distanceCallback = distanceCallback;

//     let result = new Map<Cell, number>();

//     this.pool.reset();

//     this.nodeState.clear();

//     this.openSet = new NodeHeap({
//       compare: defaultSettings.compareFScore,
//       setNodeId: defaultSettings.setHeapIndex
//     });

//     var startNode = this.pool.createNewState(from);
//     this.nodeState.set(from.id, startNode);

//     startNode.fScore = 0;

//     startNode.distanceToSource = 0;
//     this.openSet.push(startNode);
//     startNode.open = 1;

//     this.cameFrom;

//     while (this.openSet.length > 0) {
//       this.cameFrom = this.openSet.pop();
//       this.cameFrom.closed = true;

//       // if (cameFrom.distanceToSource >= 10) {
//       //   nodeState.delete(cameFrom);
//       //   continue;
//       // }

//       this.graph.forEachLinkedNode(this.cameFrom.node.id, this.visitNeighbour, false);
//     }

//     let s = new Set();
//     for (let p of this.nodeState) {
//       s.add(p[1]);
//     }
//     return s;

//   }

//   visitNeighbour(otherNode, link) {
//     var otherSearchState = this.nodeState.get(otherNode.id);
//     if (!otherSearchState) {
//       otherSearchState = this.pool.createNewState(otherNode);
//       this.nodeState.set(otherNode.id, otherSearchState);
//     }

//     if (otherSearchState.closed) {
//       // Already processed this node.
//       return;
//     }

//     if (otherSearchState.open === 0) {
//       // Remember this node.
//       this.openSet.push(otherSearchState);
//       otherSearchState.open = 1;
//     }


//     var tentativeDistance = this.cameFrom.distanceToSource + this.distanceCallback(otherNode.data, this.cameFrom.node.data, link.data);
//     if (tentativeDistance >= otherSearchState.distanceToSource) {
//       // This would only make our path longer. Ignore this route.
//       return;
//     }

//     // bingo! we found shorter path:
//     otherSearchState.parent = this.cameFrom;
//     otherSearchState.distanceToSource = tentativeDistance;
//     otherSearchState.fScore = tentativeDistance;

//     this.openSet.updateItem(otherSearchState.heapIndex);

//   }

// }
