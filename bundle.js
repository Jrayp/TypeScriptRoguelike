(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
module.exports = function eventify(subject) {
  validateSubject(subject);

  var eventsStorage = createEventsStorage(subject);
  subject.on = eventsStorage.on;
  subject.off = eventsStorage.off;
  subject.fire = eventsStorage.fire;
  return subject;
};

function createEventsStorage(subject) {
  // Store all event listeners to this hash. Key is event name, value is array
  // of callback records.
  //
  // A callback record consists of callback function and its optional context:
  // { 'eventName' => [{callback: function, ctx: object}] }
  var registeredEvents = Object.create(null);

  return {
    on: function (eventName, callback, ctx) {
      if (typeof callback !== 'function') {
        throw new Error('callback is expected to be a function');
      }
      var handlers = registeredEvents[eventName];
      if (!handlers) {
        handlers = registeredEvents[eventName] = [];
      }
      handlers.push({callback: callback, ctx: ctx});

      return subject;
    },

    off: function (eventName, callback) {
      var wantToRemoveAll = (typeof eventName === 'undefined');
      if (wantToRemoveAll) {
        // Killing old events storage should be enough in this case:
        registeredEvents = Object.create(null);
        return subject;
      }

      if (registeredEvents[eventName]) {
        var deleteAllCallbacksForEvent = (typeof callback !== 'function');
        if (deleteAllCallbacksForEvent) {
          delete registeredEvents[eventName];
        } else {
          var callbacks = registeredEvents[eventName];
          for (var i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].callback === callback) {
              callbacks.splice(i, 1);
            }
          }
        }
      }

      return subject;
    },

    fire: function (eventName) {
      var callbacks = registeredEvents[eventName];
      if (!callbacks) {
        return subject;
      }

      var fireArguments;
      if (arguments.length > 1) {
        fireArguments = Array.prototype.splice.call(arguments, 1);
      }
      for(var i = 0; i < callbacks.length; ++i) {
        var callbackInfo = callbacks[i];
        callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
      }

      return subject;
    }
  };
}

function validateSubject(subject) {
  if (!subject) {
    throw new Error('Eventify cannot use falsy object as events subject');
  }
  var reservedWords = ['on', 'fire', 'off'];
  for (var i = 0; i < reservedWords.length; ++i) {
    if (subject.hasOwnProperty(reservedWords[i])) {
      throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
    }
  }
}

},{}],3:[function(require,module,exports){
/**
 * @fileOverview Contains definition of the core graph object.
 */

// TODO: need to change storage layer:
// 1. Be able to get all nodes O(1)
// 2. Be able to get number of links O(1)

/**
 * @example
 *  var graph = require('ngraph.graph')();
 *  graph.addNode(1);     // graph has one node.
 *  graph.addLink(2, 3);  // now graph contains three nodes and one link.
 *
 */
module.exports = createGraph;

var eventify = require('ngraph.events');

/**
 * Creates a new graph
 */
function createGraph(options) {
  // Graph structure is maintained as dictionary of nodes
  // and array of links. Each node has 'links' property which
  // hold all links related to that node. And general links
  // array is used to speed up all links enumeration. This is inefficient
  // in terms of memory, but simplifies coding.
  options = options || {};
  if ('uniqueLinkId' in options) {
    console.warn(
      'ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\n' +
      'Use `multigraph` option instead\n',
      '\n',
      'Note: there is also change in default behavior: From now on each graph\n'+
      'is considered to be not a multigraph by default (each edge is unique).'
    );

    options.multigraph = options.uniqueLinkId;
  }

  // Dear reader, the non-multigraphs do not guarantee that there is only
  // one link for a given pair of node. When this option is set to false
  // we can save some memory and CPU (18% faster for non-multigraph);
  if (options.multigraph === undefined) options.multigraph = false;

  if (typeof Map !== 'function') {
    // TODO: Should we polyfill it ourselves? We don't use much operations there..
    throw new Error('ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph');
  } 

  var nodes = new Map();
  var links = [],
    // Hash of multi-edges. Used to track ids of edges between same nodes
    multiEdges = {},
    suspendEvents = 0,

    createLink = options.multigraph ? createUniqueLink : createSingleLink,

    // Our graph API provides means to listen to graph changes. Users can subscribe
    // to be notified about changes in the graph by using `on` method. However
    // in some cases they don't use it. To avoid unnecessary memory consumption
    // we will not record graph changes until we have at least one subscriber.
    // Code below supports this optimization.
    //
    // Accumulates all changes made during graph updates.
    // Each change element contains:
    //  changeType - one of the strings: 'add', 'remove' or 'update';
    //  node - if change is related to node this property is set to changed graph's node;
    //  link - if change is related to link this property is set to changed graph's link;
    changes = [],
    recordLinkChange = noop,
    recordNodeChange = noop,
    enterModification = noop,
    exitModification = noop;

  // this is our public API:
  var graphPart = {
    /**
     * Adds node to the graph. If node with given id already exists in the graph
     * its data is extended with whatever comes in 'data' argument.
     *
     * @param nodeId the node's identifier. A string or number is preferred.
     * @param [data] additional data for the node being added. If node already
     *   exists its data object is augmented with the new one.
     *
     * @return {node} The newly added node or node with given id if it already exists.
     */
    addNode: addNode,

    /**
     * Adds a link to the graph. The function always create a new
     * link between two nodes. If one of the nodes does not exists
     * a new node is created.
     *
     * @param fromId link start node id;
     * @param toId link end node id;
     * @param [data] additional data to be set on the new link;
     *
     * @return {link} The newly created link
     */
    addLink: addLink,

    /**
     * Removes link from the graph. If link does not exist does nothing.
     *
     * @param link - object returned by addLink() or getLinks() methods.
     *
     * @returns true if link was removed; false otherwise.
     */
    removeLink: removeLink,

    /**
     * Removes node with given id from the graph. If node does not exist in the graph
     * does nothing.
     *
     * @param nodeId node's identifier passed to addNode() function.
     *
     * @returns true if node was removed; false otherwise.
     */
    removeNode: removeNode,

    /**
     * Gets node with given identifier. If node does not exist undefined value is returned.
     *
     * @param nodeId requested node identifier;
     *
     * @return {node} in with requested identifier or undefined if no such node exists.
     */
    getNode: getNode,

    /**
     * Gets number of nodes in this graph.
     *
     * @return number of nodes in the graph.
     */
    getNodeCount: getNodeCount,

    /**
     * Gets total number of links in the graph.
     */
    getLinkCount: getLinkCount,

    /**
     * Synonym for `getLinkCount()`
     */
    getLinksCount: getLinkCount,
    
    /**
     * Synonym for `getNodeCount()`
     */
    getNodesCount: getNodeCount,

    /**
     * Gets all links (inbound and outbound) from the node with given id.
     * If node with given id is not found null is returned.
     *
     * @param nodeId requested node identifier.
     *
     * @return Array of links from and to requested node if such node exists;
     *   otherwise null is returned.
     */
    getLinks: getLinks,

    /**
     * Invokes callback on each node of the graph.
     *
     * @param {Function(node)} callback Function to be invoked. The function
     *   is passed one argument: visited node.
     */
    forEachNode: forEachNode,

    /**
     * Invokes callback on every linked (adjacent) node to the given one.
     *
     * @param nodeId Identifier of the requested node.
     * @param {Function(node, link)} callback Function to be called on all linked nodes.
     *   The function is passed two parameters: adjacent node and link object itself.
     * @param oriented if true graph treated as oriented.
     */
    forEachLinkedNode: forEachLinkedNode,

    /**
     * Enumerates all links in the graph
     *
     * @param {Function(link)} callback Function to be called on all links in the graph.
     *   The function is passed one parameter: graph's link object.
     *
     * Link object contains at least the following fields:
     *  fromId - node id where link starts;
     *  toId - node id where link ends,
     *  data - additional data passed to graph.addLink() method.
     */
    forEachLink: forEachLink,

    /**
     * Suspend all notifications about graph changes until
     * endUpdate is called.
     */
    beginUpdate: enterModification,

    /**
     * Resumes all notifications about graph changes and fires
     * graph 'changed' event in case there are any pending changes.
     */
    endUpdate: exitModification,

    /**
     * Removes all nodes and links from the graph.
     */
    clear: clear,

    /**
     * Detects whether there is a link between two nodes.
     * Operation complexity is O(n) where n - number of links of a node.
     * NOTE: this function is synonim for getLink()
     *
     * @returns link if there is one. null otherwise.
     */
    hasLink: getLink,

    /**
     * Detects whether there is a node with given id
     * 
     * Operation complexity is O(1)
     * NOTE: this function is synonim for getNode()
     *
     * @returns node if there is one; Falsy value otherwise.
     */
    hasNode: getNode,

    /**
     * Gets an edge between two nodes.
     * Operation complexity is O(n) where n - number of links of a node.
     *
     * @param {string} fromId link start identifier
     * @param {string} toId link end identifier
     *
     * @returns link if there is one. null otherwise.
     */
    getLink: getLink
  };

  // this will add `on()` and `fire()` methods.
  eventify(graphPart);

  monitorSubscribers();

  return graphPart;

  function monitorSubscribers() {
    var realOn = graphPart.on;

    // replace real `on` with our temporary on, which will trigger change
    // modification monitoring:
    graphPart.on = on;

    function on() {
      // now it's time to start tracking stuff:
      graphPart.beginUpdate = enterModification = enterModificationReal;
      graphPart.endUpdate = exitModification = exitModificationReal;
      recordLinkChange = recordLinkChangeReal;
      recordNodeChange = recordNodeChangeReal;

      // this will replace current `on` method with real pub/sub from `eventify`.
      graphPart.on = realOn;
      // delegate to real `on` handler:
      return realOn.apply(graphPart, arguments);
    }
  }

  function recordLinkChangeReal(link, changeType) {
    changes.push({
      link: link,
      changeType: changeType
    });
  }

  function recordNodeChangeReal(node, changeType) {
    changes.push({
      node: node,
      changeType: changeType
    });
  }

  function addNode(nodeId, data) {
    if (nodeId === undefined) {
      throw new Error('Invalid node identifier');
    }

    enterModification();

    var node = getNode(nodeId);
    if (!node) {
      node = new Node(nodeId, data);
      recordNodeChange(node, 'add');
    } else {
      node.data = data;
      recordNodeChange(node, 'update');
    }

    nodes.set(nodeId, node);

    exitModification();
    return node;
  }

  function getNode(nodeId) {
    return nodes.get(nodeId);
  }

  function removeNode(nodeId) {
    var node = getNode(nodeId);
    if (!node) {
      return false;
    }

    enterModification();

    var prevLinks = node.links;
    if (prevLinks) {
      node.links = null;
      for(var i = 0; i < prevLinks.length; ++i) {
        removeLink(prevLinks[i]);
      }
    }

    nodes.delete(nodeId)

    recordNodeChange(node, 'remove');

    exitModification();

    return true;
  }


  function addLink(fromId, toId, data) {
    enterModification();

    var fromNode = getNode(fromId) || addNode(fromId);
    var toNode = getNode(toId) || addNode(toId);

    var link = createLink(fromId, toId, data);

    links.push(link);

    // TODO: this is not cool. On large graphs potentially would consume more memory.
    addLinkToNode(fromNode, link);
    if (fromId !== toId) {
      // make sure we are not duplicating links for self-loops
      addLinkToNode(toNode, link);
    }

    recordLinkChange(link, 'add');

    exitModification();

    return link;
  }

  function createSingleLink(fromId, toId, data) {
    var linkId = makeLinkId(fromId, toId);
    return new Link(fromId, toId, data, linkId);
  }

  function createUniqueLink(fromId, toId, data) {
    // TODO: Get rid of this method.
    var linkId = makeLinkId(fromId, toId);
    var isMultiEdge = multiEdges.hasOwnProperty(linkId);
    if (isMultiEdge || getLink(fromId, toId)) {
      if (!isMultiEdge) {
        multiEdges[linkId] = 0;
      }
      var suffix = '@' + (++multiEdges[linkId]);
      linkId = makeLinkId(fromId + suffix, toId + suffix);
    }

    return new Link(fromId, toId, data, linkId);
  }

  function getNodeCount() {
    return nodes.size;
  }

  function getLinkCount() {
    return links.length;
  }

  function getLinks(nodeId) {
    var node = getNode(nodeId);
    return node ? node.links : null;
  }

  function removeLink(link) {
    if (!link) {
      return false;
    }
    var idx = indexOfElementInArray(link, links);
    if (idx < 0) {
      return false;
    }

    enterModification();

    links.splice(idx, 1);

    var fromNode = getNode(link.fromId);
    var toNode = getNode(link.toId);

    if (fromNode) {
      idx = indexOfElementInArray(link, fromNode.links);
      if (idx >= 0) {
        fromNode.links.splice(idx, 1);
      }
    }

    if (toNode) {
      idx = indexOfElementInArray(link, toNode.links);
      if (idx >= 0) {
        toNode.links.splice(idx, 1);
      }
    }

    recordLinkChange(link, 'remove');

    exitModification();

    return true;
  }

  function getLink(fromNodeId, toNodeId) {
    // TODO: Use sorted links to speed this up
    var node = getNode(fromNodeId),
      i;
    if (!node || !node.links) {
      return null;
    }

    for (i = 0; i < node.links.length; ++i) {
      var link = node.links[i];
      if (link.fromId === fromNodeId && link.toId === toNodeId) {
        return link;
      }
    }

    return null; // no link.
  }

  function clear() {
    enterModification();
    forEachNode(function(node) {
      removeNode(node.id);
    });
    exitModification();
  }

  function forEachLink(callback) {
    var i, length;
    if (typeof callback === 'function') {
      for (i = 0, length = links.length; i < length; ++i) {
        callback(links[i]);
      }
    }
  }

  function forEachLinkedNode(nodeId, callback, oriented) {
    var node = getNode(nodeId);

    if (node && node.links && typeof callback === 'function') {
      if (oriented) {
        return forEachOrientedLink(node.links, nodeId, callback);
      } else {
        return forEachNonOrientedLink(node.links, nodeId, callback);
      }
    }
  }

  function forEachNonOrientedLink(links, nodeId, callback) {
    var quitFast;
    for (var i = 0; i < links.length; ++i) {
      var link = links[i];
      var linkedNodeId = link.fromId === nodeId ? link.toId : link.fromId;

      quitFast = callback(nodes.get(linkedNodeId), link);
      if (quitFast) {
        return true; // Client does not need more iterations. Break now.
      }
    }
  }

  function forEachOrientedLink(links, nodeId, callback) {
    var quitFast;
    for (var i = 0; i < links.length; ++i) {
      var link = links[i];
      if (link.fromId === nodeId) {
        quitFast = callback(nodes.get(link.toId), link)
        if (quitFast) {
          return true; // Client does not need more iterations. Break now.
        }
      }
    }
  }

  // we will not fire anything until users of this library explicitly call `on()`
  // method.
  function noop() {}

  // Enter, Exit modification allows bulk graph updates without firing events.
  function enterModificationReal() {
    suspendEvents += 1;
  }

  function exitModificationReal() {
    suspendEvents -= 1;
    if (suspendEvents === 0 && changes.length > 0) {
      graphPart.fire('changed', changes);
      changes.length = 0;
    }
  }

  function forEachNode(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Function is expected to iterate over graph nodes. You passed ' + callback);
    }

    var valuesIterator = nodes.values();
    var nextValue = valuesIterator.next();
    while (!nextValue.done) {
      if (callback(nextValue.value)) {
        return true; // client doesn't want to proceed. Return.
      }
      nextValue = valuesIterator.next();
    }
  }
}

// need this for old browsers. Should this be a separate module?
function indexOfElementInArray(element, array) {
  if (!array) return -1;

  if (array.indexOf) {
    return array.indexOf(element);
  }

  var len = array.length,
    i;

  for (i = 0; i < len; i += 1) {
    if (array[i] === element) {
      return i;
    }
  }

  return -1;
}

/**
 * Internal structure to represent node;
 */
function Node(id, data) {
  this.id = id;
  this.links = null;
  this.data = data;
}

function addLinkToNode(node, link) {
  if (node.links) {
    node.links.push(link);
  } else {
    node.links = [link];
  }
}

/**
 * Internal structure to represent links;
 */
function Link(fromId, toId, data, id) {
  this.fromId = fromId;
  this.toId = toId;
  this.data = data;
  this.id = id;
}

function makeLinkId(fromId, toId) {
  return fromId.toString() + '≡ƒæë ' + toId.toString();
}

},{"ngraph.events":2}],4:[function(require,module,exports){
/**
 * Based on https://github.com/mourner/tinyqueue
 * Copyright (c) 2017, Vladimir Agafonkin https://github.com/mourner/tinyqueue/blob/master/LICENSE
 * 
 * Adapted for PathFinding needs by @anvaka
 * Copyright (c) 2017, Andrei Kashcha
 */
module.exports = NodeHeap;

function NodeHeap(data, options) {
  if (!(this instanceof NodeHeap)) return new NodeHeap(data, options);

  if (!Array.isArray(data)) {
    // assume first argument is our config object;
    options = data;
    data = [];
  }

  options = options || {};

  this.data = data || [];
  this.length = this.data.length;
  this.compare = options.compare || defaultCompare;
  this.setNodeId = options.setNodeId || noop;

  if (this.length > 0) {
    for (var i = (this.length >> 1); i >= 0; i--) this._down(i);
  }

  if (options.setNodeId) {
    for (var i = 0; i < this.length; ++i) {
      this.setNodeId(this.data[i], i);
    }
  }
}

function noop() {}

function defaultCompare(a, b) {
  return a - b;
}

NodeHeap.prototype = {

  push: function (item) {
    this.data.push(item);
    this.setNodeId(item, this.length);
    this.length++;
    this._up(this.length - 1);
  },

  pop: function () {
    if (this.length === 0) return undefined;

    var top = this.data[0];
    this.length--;

    if (this.length > 0) {
      this.data[0] = this.data[this.length];
      this.setNodeId(this.data[0], 0);
      this._down(0);
    }
    this.data.pop();

    return top;
  },

  peek: function () {
    return this.data[0];
  },

  updateItem: function (pos) {
    this._down(pos);
    this._up(pos);
  },

  _up: function (pos) {
    var data = this.data;
    var compare = this.compare;
    var setNodeId = this.setNodeId;
    var item = data[pos];

    while (pos > 0) {
      var parent = (pos - 1) >> 1;
      var current = data[parent];
      if (compare(item, current) >= 0) break;
        data[pos] = current;

       setNodeId(current, pos);
       pos = parent;
    }

    data[pos] = item;
    setNodeId(item, pos);
  },

  _down: function (pos) {
    var data = this.data;
    var compare = this.compare;
    var halfLength = this.length >> 1;
    var item = data[pos];
    var setNodeId = this.setNodeId;

    while (pos < halfLength) {
      var left = (pos << 1) + 1;
      var right = left + 1;
      var best = data[left];

      if (right < this.length && compare(data[right], best) < 0) {
        left = right;
        best = data[right];
      }
      if (compare(best, item) >= 0) break;

      data[pos] = best;
      setNodeId(best, pos);
      pos = left;
    }

    data[pos] = item;
    setNodeId(item, pos);
  }
};
},{}],5:[function(require,module,exports){
/**
 * Performs suboptimal, greed A Star path finding.
 * This finder does not necessary finds the shortest path. The path
 * that it finds is very close to the shortest one. It is very fast though.
 */
module.exports = aStarBi;

var NodeHeap = require('./NodeHeap');
var makeSearchStatePool = require('./makeSearchStatePool');
var heuristics = require('./heuristics');
var defaultSettings = require('./defaultSettings');

var BY_FROM = 1;
var BY_TO = 2;
var NO_PATH = defaultSettings.NO_PATH;

module.exports.l2 = heuristics.l2;
module.exports.l1 = heuristics.l1;

/**
 * Creates a new instance of pathfinder. A pathfinder has just one method:
 * `find(fromId, toId)`, it may be extended in future.
 * 
 * NOTE: Algorithm implemented in this code DOES NOT find optimal path.
 * Yet the path that it finds is always near optimal, and it finds it very fast.
 * 
 * @param {ngraph.graph} graph instance. See https://github.com/anvaka/ngraph.graph
 * 
 * @param {Object} options that configures search
 * @param {Function(a, b)} options.heuristic - a function that returns estimated distance between
 * nodes `a` and `b`.  Defaults function returns 0, which makes this search equivalent to Dijkstra search.
 * @param {Function(a, b)} options.distance - a function that returns actual distance between two
 * nodes `a` and `b`. By default this is set to return graph-theoretical distance (always 1);
 * @param {Boolean} options.oriented - whether graph should be considered oriented or not.
 * 
 * @returns {Object} A pathfinder with single method `find()`.
 */
function aStarBi(graph, options) {
  options = options || {};
  // whether traversal should be considered over oriented graph.
  var oriented = options.oriented;

  var heuristic = options.heuristic;
  if (!heuristic) heuristic = defaultSettings.heuristic;

  var distance = options.distance;
  if (!distance) distance = defaultSettings.distance;
  var pool = makeSearchStatePool();

  return {
    find: find
  };

  function find(fromId, toId) {
    // Not sure if we should return NO_PATH or throw. Throw seem to be more
    // helpful to debug errors. So, throwing.
    var from = graph.getNode(fromId);
    if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
    var to = graph.getNode(toId);
    if (!to) throw new Error('toId is not defined in this graph: ' + toId);

    if (from === to) return [from]; // trivial case.

    pool.reset();

    var callVisitor = oriented ? orientedVisitor : nonOrientedVisitor;

    // Maps nodeId to NodeSearchState.
    var nodeState = new Map();

    var openSetFrom = new NodeHeap({
      compare: defaultSettings.compareFScore,
      setNodeId: defaultSettings.setHeapIndex
    });

    var openSetTo = new NodeHeap({
      compare: defaultSettings.compareFScore,
      setNodeId: defaultSettings.setHeapIndex
    });


    var startNode = pool.createNewState(from);
    nodeState.set(fromId, startNode);

    // For the first node, fScore is completely heuristic.
    startNode.fScore = heuristic(from, to);
    // The cost of going from start to start is zero.
    startNode.distanceToSource = 0;
    openSetFrom.push(startNode);
    startNode.open = BY_FROM;

    var endNode = pool.createNewState(to);
    endNode.fScore = heuristic(to, from);
    endNode.distanceToSource = 0;
    openSetTo.push(endNode);
    endNode.open = BY_TO;

    // Cost of the best solution found so far. Used for accurate termination
    var lMin = Number.POSITIVE_INFINITY;
    var minFrom;
    var minTo;

    var currentSet = openSetFrom;
    var currentOpener = BY_FROM;

    while (openSetFrom.length > 0 && openSetTo.length > 0) {
      if (openSetFrom.length < openSetTo.length) {
        // we pick a set with less elements
        currentOpener = BY_FROM;
        currentSet = openSetFrom;
      } else {
        currentOpener = BY_TO;
        currentSet = openSetTo;
      }

      var current = currentSet.pop();

      // no need to visit this node anymore
      current.closed = true;

      if (current.distanceToSource > lMin) continue;

      graph.forEachLinkedNode(current.node.id, callVisitor);

      if (minFrom && minTo) {
        // This is not necessary the best path, but we are so greedy that we
        // can't resist:
        return reconstructBiDirectionalPath(minFrom, minTo);
      }
    }

    return NO_PATH; // No path.

    function nonOrientedVisitor(otherNode, link) {
      return visitNode(otherNode, link, current);
    }

    function orientedVisitor(otherNode, link) {
      // For oritned graphs we need to reverse graph, when traveling
      // backwards. So, we use non-oriented ngraph's traversal, and 
      // filter link orientation here.
      if (currentOpener === BY_FROM) {
        if (link.fromId === current.node.id) return visitNode(otherNode, link, current)
      } else if (currentOpener === BY_TO) {
        if (link.toId === current.node.id) return visitNode(otherNode, link, current);
      }
    }

    function canExit(currentNode) {
      var opener = currentNode.open
      if (opener && opener !== currentOpener) {
        return true;
      }

      return false;
    }

    function reconstructBiDirectionalPath(a, b) {
      var pathOfNodes = [];
      var aParent = a;
      while(aParent) {
        pathOfNodes.push(aParent.node);
        aParent = aParent.parent;
      }
      var bParent = b;
      while (bParent) {
        pathOfNodes.unshift(bParent.node);
        bParent = bParent.parent
      }
      return pathOfNodes;
    }

    function visitNode(otherNode, link, cameFrom) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = pool.createNewState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (otherSearchState.closed) {
        // Already processed this node.
        return;
      }

      if (canExit(otherSearchState, cameFrom)) {
        // this node was opened by alternative opener. The sets intersect now,
        // we found an optimal path, that goes through *this* node. However, there
        // is no guarantee that this is the global optimal solution path.

        var potentialLMin = otherSearchState.distanceToSource + cameFrom.distanceToSource;
        if (potentialLMin < lMin) {
          minFrom = otherSearchState;
          minTo = cameFrom
          lMin = potentialLMin;
        }
        // we are done with this node.
        return;
      }

      var tentativeDistance = cameFrom.distanceToSource + distance(otherSearchState.node, cameFrom.node, link);

      if (tentativeDistance >= otherSearchState.distanceToSource) {
        // This would only make our path longer. Ignore this route.
        return;
      }

      // Choose target based on current working set:
      var target = (currentOpener === BY_FROM) ? to : from;
      var newFScore = tentativeDistance + heuristic(otherSearchState.node, target);
      if (newFScore >= lMin) {
        // this can't be optimal path, as we have already found a shorter path.
        return;
      }
      otherSearchState.fScore = newFScore;

      if (otherSearchState.open === 0) {
        // Remember this node in the current set
        currentSet.push(otherSearchState);
        currentSet.updateItem(otherSearchState.heapIndex);

        otherSearchState.open = currentOpener;
      }

      // bingo! we found shorter path:
      otherSearchState.parent = cameFrom;
      otherSearchState.distanceToSource = tentativeDistance;
    }
  }
}

},{"./NodeHeap":4,"./defaultSettings":7,"./heuristics":8,"./makeSearchStatePool":9}],6:[function(require,module,exports){
/**
 * Performs a uni-directional A Star search on graph.
 * 
 * We will try to minimize f(n) = g(n) + h(n), where
 * g(n) is actual distance from source node to `n`, and
 * h(n) is heuristic distance from `n` to target node.
 */
module.exports = aStarPathSearch;

var NodeHeap = require('./NodeHeap');
var makeSearchStatePool = require('./makeSearchStatePool');
var heuristics = require('./heuristics');
var defaultSettings = require('./defaultSettings.js');

var NO_PATH = defaultSettings.NO_PATH;

module.exports.l2 = heuristics.l2;
module.exports.l1 = heuristics.l1;

/**
 * Creates a new instance of pathfinder. A pathfinder has just one method:
 * `find(fromId, toId)`, it may be extended in future.
 * 
 * @param {ngraph.graph} graph instance. See https://github.com/anvaka/ngraph.graph
 * @param {Object} options that configures search
 * @param {Function(a, b)} options.heuristic - a function that returns estimated distance between
 * nodes `a` and `b`. This function should never overestimate actual distance between two
 * nodes (otherwise the found path will not be the shortest). Defaults function returns 0,
 * which makes this search equivalent to Dijkstra search.
 * @param {Function(a, b)} options.distance - a function that returns actual distance between two
 * nodes `a` and `b`. By default this is set to return graph-theoretical distance (always 1);
 * @param {Boolean} options.oriented - whether graph should be considered oriented or not.
 * 
 * @returns {Object} A pathfinder with single method `find()`.
 */
function aStarPathSearch(graph, options) {
  options = options || {};
  // whether traversal should be considered over oriented graph.
  var oriented = options.oriented;

  var heuristic = options.heuristic;
  if (!heuristic) heuristic = defaultSettings.heuristic;

  var distance = options.distance;
  if (!distance) distance = defaultSettings.distance;
  var pool = makeSearchStatePool();

  return {
    /**
     * Finds a path between node `fromId` and `toId`.
     * @returns {Array} of nodes between `toId` and `fromId`. Empty array is returned
     * if no path is found.
     */
    find: find
  };

  function find(fromId, toId) {
    var from = graph.getNode(fromId);
    if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
    var to = graph.getNode(toId);
    if (!to) throw new Error('toId is not defined in this graph: ' + toId);
    pool.reset();

    // Maps nodeId to NodeSearchState.
    var nodeState = new Map();

    // the nodes that we still need to evaluate
    var openSet = new NodeHeap({
      compare: defaultSettings.compareFScore,
      setNodeId: defaultSettings.setHeapIndex
    });

    var startNode = pool.createNewState(from);
    nodeState.set(fromId, startNode);

    // For the first node, fScore is completely heuristic.
    startNode.fScore = heuristic(from, to);

    // The cost of going from start to start is zero.
    startNode.distanceToSource = 0;
    openSet.push(startNode);
    startNode.open = 1;

    var cameFrom;

    while (openSet.length > 0) {
      cameFrom = openSet.pop();
      if (goalReached(cameFrom, to)) return reconstructPath(cameFrom);

      // no need to visit this node anymore
      cameFrom.closed = true;
      graph.forEachLinkedNode(cameFrom.node.id, visitNeighbour, oriented);
    }

    // If we got here, then there is no path.
    return NO_PATH;

    function visitNeighbour(otherNode, link) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = pool.createNewState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (otherSearchState.closed) {
        // Already processed this node.
        return;
      }
      if (otherSearchState.open === 0) {
        // Remember this node.
        openSet.push(otherSearchState);
        otherSearchState.open = 1;
      }

      var tentativeDistance = cameFrom.distanceToSource + distance(otherNode, cameFrom.node, link);
      if (tentativeDistance >= otherSearchState.distanceToSource) {
        // This would only make our path longer. Ignore this route.
        return;
      }

      // bingo! we found shorter path:
      otherSearchState.parent = cameFrom;
      otherSearchState.distanceToSource = tentativeDistance;
      otherSearchState.fScore = tentativeDistance + heuristic(otherSearchState.node, to);

      openSet.updateItem(otherSearchState.heapIndex);
    }
  }
}

function goalReached(searchState, targetNode) {
  return searchState.node === targetNode;
}

function reconstructPath(searchState) {
  var path = [searchState.node];
  var parent = searchState.parent;

  while (parent) {
    path.push(parent.node);
    parent = parent.parent;
  }

  return path;
}

},{"./NodeHeap":4,"./defaultSettings.js":7,"./heuristics":8,"./makeSearchStatePool":9}],7:[function(require,module,exports){
// We reuse instance of array, but we trie to freeze it as well,
// so that consumers don't modify it. Maybe it's a bad idea.
var NO_PATH = [];
if (typeof Object.freeze === 'function') Object.freeze(NO_PATH);

module.exports = {
  // Path search settings
  heuristic: blindHeuristic,
  distance: constantDistance,
  compareFScore: compareFScore,
  NO_PATH: NO_PATH,

  // heap settings
  setHeapIndex: setHeapIndex,

  // nba:
  setH1: setH1,
  setH2: setH2,
  compareF1Score: compareF1Score,
  compareF2Score: compareF2Score,
}

function blindHeuristic(/* a, b */) {
  // blind heuristic makes this search equal to plain Dijkstra path search.
  return 0;
}

function constantDistance(/* a, b */) {
  return 1;
}

function compareFScore(a, b) {
  var result = a.fScore - b.fScore;
  // TODO: Can I improve speed with smarter ties-breaking?
  // I tried distanceToSource, but it didn't seem to have much effect
  return result;
}

function setHeapIndex(nodeSearchState, heapIndex) {
  nodeSearchState.heapIndex = heapIndex;
}

function compareF1Score(a, b) {
  return a.f1 - b.f1;
}

function compareF2Score(a, b) {
  return a.f2 - b.f2;
}

function setH1(node, heapIndex) {
  node.h1 = heapIndex;
}

function setH2(node, heapIndex) {
  node.h2 = heapIndex;
}
},{}],8:[function(require,module,exports){
module.exports = {
  l2: l2,
  l1: l1
};

/**
 * Euclid distance (l2 norm);
 * 
 * @param {*} a 
 * @param {*} b 
 */
function l2(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Manhattan distance (l1 norm);
 * @param {*} a 
 * @param {*} b 
 */
function l1(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.abs(dx) + Math.abs(dy);
}

},{}],9:[function(require,module,exports){
/**
 * This class represents a single search node in the exploration tree for
 * A* algorithm.
 * 
 * @param {Object} node  original node in the graph
 */
function NodeSearchState(node) {
  this.node = node;

  // How we came to this node?
  this.parent = null;

  this.closed = false;
  this.open = 0;

  this.distanceToSource = Number.POSITIVE_INFINITY;
  // the f(n) = g(n) + h(n) value
  this.fScore = Number.POSITIVE_INFINITY;

  // used to reconstruct heap when fScore is updated.
  this.heapIndex = -1;
};

function makeSearchStatePool() {
  var currentInCache = 0;
  var nodeCache = [];

  return {
    createNewState: createNewState,
    reset: reset
  };

  function reset() {
    currentInCache = 0;
  }

  function createNewState(node) {
    var cached = nodeCache[currentInCache];
    if (cached) {
      // TODO: This almost duplicates constructor code. Not sure if
      // it would impact performance if I move this code into a function
      cached.node = node;
      // How we came to this node?
      cached.parent = null;

      cached.closed = false;
      cached.open = 0;

      cached.distanceToSource = Number.POSITIVE_INFINITY;
      // the f(n) = g(n) + h(n) value
      cached.fScore = Number.POSITIVE_INFINITY;

      // used to reconstruct heap when fScore is updated.
      cached.heapIndex = -1;

    } else {
      cached = new NodeSearchState(node);
      nodeCache[currentInCache] = cached;
    }
    currentInCache++;
    return cached;
  }
}
module.exports = makeSearchStatePool;
},{}],10:[function(require,module,exports){
module.exports = nba;

var NodeHeap = require('../NodeHeap');
var heuristics = require('../heuristics');
var defaultSettings = require('../defaultSettings.js');
var makeNBASearchStatePool = require('./makeNBASearchStatePool.js');

var NO_PATH = defaultSettings.NO_PATH;

module.exports.l2 = heuristics.l2;
module.exports.l1 = heuristics.l1;

/**
 * Creates a new instance of pathfinder. A pathfinder has just one method:
 * `find(fromId, toId)`.
 * 
 * This is implementation of the NBA* algorithm described in 
 * 
 *  "Yet another bidirectional algorithm for shortest paths" paper by Wim Pijls and Henk Post
 * 
 * The paper is available here: https://repub.eur.nl/pub/16100/ei2009-10.pdf
 * 
 * @param {ngraph.graph} graph instance. See https://github.com/anvaka/ngraph.graph
 * @param {Object} options that configures search
 * @param {Function(a, b)} options.heuristic - a function that returns estimated distance between
 * nodes `a` and `b`. This function should never overestimate actual distance between two
 * nodes (otherwise the found path will not be the shortest). Defaults function returns 0,
 * which makes this search equivalent to Dijkstra search.
 * @param {Function(a, b)} options.distance - a function that returns actual distance between two
 * nodes `a` and `b`. By default this is set to return graph-theoretical distance (always 1);
 * 
 * @returns {Object} A pathfinder with single method `find()`.
 */
function nba(graph, options) {
  options = options || {};
  // whether traversal should be considered over oriented graph.
  var oriented = options.oriented;
  var quitFast = options.quitFast;

  var heuristic = options.heuristic;
  if (!heuristic) heuristic = defaultSettings.heuristic;

  var distance = options.distance;
  if (!distance) distance = defaultSettings.distance;

  // During stress tests I noticed that garbage collection was one of the heaviest
  // contributors to the algorithm's speed. So I'm using an object pool to recycle nodes.
  var pool = makeNBASearchStatePool();

  return {
    /**
     * Finds a path between node `fromId` and `toId`.
     * @returns {Array} of nodes between `toId` and `fromId`. Empty array is returned
     * if no path is found.
     */
    find: find
  };

  function find(fromId, toId) {
    // I must apologize for the code duplication. This was the easiest way for me to
    // implement the algorithm fast.
    var from = graph.getNode(fromId);
    if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
    var to = graph.getNode(toId);
    if (!to) throw new Error('toId is not defined in this graph: ' + toId);

    pool.reset();

    // I must also apologize for somewhat cryptic names. The NBA* is bi-directional
    // search algorithm, which means it runs two searches in parallel. One is called
    // forward search and it runs from source node to target, while the other one
    // (backward search) runs from target to source.

    // Everywhere where you see `1` it means it's for the forward search. `2` is for 
    // backward search.

    // For oriented graph path finding, we need to reverse the graph, so that
    // backward search visits correct link. Obviously we don't want to duplicate
    // the graph, instead we always traverse the graph as non-oriented, and filter
    // edges in `visitN1Oriented/visitN2Oritented`
    var forwardVisitor = oriented ? visitN1Oriented : visitN1;
    var reverseVisitor = oriented ? visitN2Oriented : visitN2;

    // Maps nodeId to NBASearchState.
    var nodeState = new Map();

    // These two heaps store nodes by their underestimated values.
    var open1Set = new NodeHeap({
      compare: defaultSettings.compareF1Score,
      setNodeId: defaultSettings.setH1
    });
    var open2Set = new NodeHeap({
      compare: defaultSettings.compareF2Score,
      setNodeId: defaultSettings.setH2
    });

    // This is where both searches will meet.
    var minNode;

    // The smallest path length seen so far is stored here:
    var lMin = Number.POSITIVE_INFINITY;

    // We start by putting start/end nodes to the corresponding heaps
    // If variable names like `f1`, `g1` are too confusing, please refer
    // to makeNBASearchStatePool.js file, which has detailed description.
    var startNode = pool.createNewState(from);
    nodeState.set(fromId, startNode); 
    startNode.g1 = 0;
    var f1 = heuristic(from, to);
    startNode.f1 = f1;
    open1Set.push(startNode);

    var endNode = pool.createNewState(to);
    nodeState.set(toId, endNode);
    endNode.g2 = 0;
    var f2 = f1; // they should agree originally
    endNode.f2 = f2;
    open2Set.push(endNode)

    // the `cameFrom` variable is accessed by both searches, so that we can store parents.
    var cameFrom;

    // this is the main algorithm loop:
    while (open2Set.length && open1Set.length) {
      if (open1Set.length < open2Set.length) {
        forwardSearch();
      } else {
        reverseSearch();
      }

      if (quitFast && minNode) break;
    }

    var path = reconstructPath(minNode);
    return path; // the public API is over

    function forwardSearch() {
      cameFrom = open1Set.pop();
      if (cameFrom.closed) {
        return;
      }

      cameFrom.closed = true;

      if (cameFrom.f1 < lMin && (cameFrom.g1 + f2 - heuristic(from, cameFrom.node)) < lMin) {
        graph.forEachLinkedNode(cameFrom.node.id, forwardVisitor);
      }

      if (open1Set.length > 0) {
        // this will be used in reverse search
        f1 = open1Set.peek().f1;
      } 
    }

    function reverseSearch() {
      cameFrom = open2Set.pop();
      if (cameFrom.closed) {
        return;
      }
      cameFrom.closed = true;

      if (cameFrom.f2 < lMin && (cameFrom.g2 + f1 - heuristic(cameFrom.node, to)) < lMin) {
        graph.forEachLinkedNode(cameFrom.node.id, reverseVisitor);
      }

      if (open2Set.length > 0) {
        // this will be used in forward search
        f2 = open2Set.peek().f2;
      }
    }

    function visitN1(otherNode, link) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = pool.createNewState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (otherSearchState.closed) return;

      var tentativeDistance = cameFrom.g1 + distance(cameFrom.node, otherNode, link);

      if (tentativeDistance < otherSearchState.g1) {
        otherSearchState.g1 = tentativeDistance;
        otherSearchState.f1 = tentativeDistance + heuristic(otherSearchState.node, to);
        otherSearchState.p1 = cameFrom;
        if (otherSearchState.h1 < 0) {
          open1Set.push(otherSearchState);
        } else {
          open1Set.updateItem(otherSearchState.h1);
        }
      }
      var potentialMin = otherSearchState.g1 + otherSearchState.g2;
      if (potentialMin < lMin) { 
        lMin = potentialMin;
        minNode = otherSearchState;
      }
    }

    function visitN2(otherNode, link) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = pool.createNewState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (otherSearchState.closed) return;

      var tentativeDistance = cameFrom.g2 + distance(cameFrom.node, otherNode, link);

      if (tentativeDistance < otherSearchState.g2) {
        otherSearchState.g2 = tentativeDistance;
        otherSearchState.f2 = tentativeDistance + heuristic(from, otherSearchState.node);
        otherSearchState.p2 = cameFrom;
        if (otherSearchState.h2 < 0) {
          open2Set.push(otherSearchState);
        } else {
          open2Set.updateItem(otherSearchState.h2);
        }
      }
      var potentialMin = otherSearchState.g1 + otherSearchState.g2;
      if (potentialMin < lMin) {
        lMin = potentialMin;
        minNode = otherSearchState;
      }
    }

    function visitN2Oriented(otherNode, link) {
      // we are going backwards, graph needs to be reversed. 
      if (link.toId === cameFrom.node.id) return visitN2(otherNode, link);
    }
    function visitN1Oriented(otherNode, link) {
      // this is forward direction, so we should be coming FROM:
      if (link.fromId === cameFrom.node.id) return visitN1(otherNode, link);
    }
  }
}

function reconstructPath(searchState) {
  if (!searchState) return NO_PATH;

  var path = [searchState.node];
  var parent = searchState.p1;

  while (parent) {
    path.push(parent.node);
    parent = parent.p1;
  }

  var child = searchState.p2;

  while (child) {
    path.unshift(child.node);
    child = child.p2;
  }
  return path;
}

},{"../NodeHeap":4,"../defaultSettings.js":7,"../heuristics":8,"./makeNBASearchStatePool.js":11}],11:[function(require,module,exports){
module.exports = makeNBASearchStatePool;

/**
 * Creates new instance of NBASearchState. The instance stores information
 * about search state, and is used by NBA* algorithm.
 *
 * @param {Object} node - original graph node
 */
function NBASearchState(node) {
  /**
   * Original graph node.
   */
  this.node = node;

  /**
   * Parent of this node in forward search
   */
  this.p1 = null;

  /**
   * Parent of this node in reverse search
   */
  this.p2 = null;

  /**
   * If this is set to true, then the node was already processed
   * and we should not touch it anymore.
   */
  this.closed = false;

  /**
   * Actual distance from this node to its parent in forward search
   */
  this.g1 = Number.POSITIVE_INFINITY;

  /**
   * Actual distance from this node to its parent in reverse search
   */
  this.g2 = Number.POSITIVE_INFINITY;


  /**
   * Underestimated distance from this node to the path-finding source.
   */
  this.f1 = Number.POSITIVE_INFINITY;

  /**
   * Underestimated distance from this node to the path-finding target.
   */
  this.f2 = Number.POSITIVE_INFINITY;

  // used to reconstruct heap when fScore is updated. TODO: do I need them both?

  /**
   * Index of this node in the forward heap.
   */
  this.h1 = -1;

  /**
   * Index of this node in the reverse heap.
   */
  this.h2 = -1;
}

/**
 * As path-finding is memory-intensive process, we want to reduce pressure on
 * garbage collector. This class helps us to recycle path-finding nodes and significantly
 * reduces the search time (~20% faster than without it).
 */
function makeNBASearchStatePool() {
  var currentInCache = 0;
  var nodeCache = [];

  return {
    /**
     * Creates a new NBASearchState instance
     */
    createNewState: createNewState,

    /**
     * Marks all created instances available for recycling.
     */
    reset: reset
  };

  function reset() {
    currentInCache = 0;
  }

  function createNewState(node) {
    var cached = nodeCache[currentInCache];
    if (cached) {
      // TODO: This almost duplicates constructor code. Not sure if
      // it would impact performance if I move this code into a function
      cached.node = node;

      // How we came to this node?
      cached.p1 = null;
      cached.p2 = null;

      cached.closed = false;

      cached.g1 = Number.POSITIVE_INFINITY;
      cached.g2 = Number.POSITIVE_INFINITY;
      cached.f1 = Number.POSITIVE_INFINITY;
      cached.f2 = Number.POSITIVE_INFINITY;

      // used to reconstruct heap when fScore is updated.
      cached.h1 = -1;
      cached.h2 = -1;
    } else {
      cached = new NBASearchState(node);
      nodeCache[currentInCache] = cached;
    }
    currentInCache++;
    return cached;
  }
}

},{}],12:[function(require,module,exports){
module.exports = {
  aStar: require('./a-star/a-star.js'),
  aGreedy: require('./a-star/a-greedy-star'),
  nba: require('./a-star/nba/index.js'),
}

},{"./a-star/a-greedy-star":5,"./a-star/a-star.js":6,"./a-star/nba/index.js":10}],13:[function(require,module,exports){
(function (global){(function (){
!function(e){"use strict";function t(e,t){this.options={},e=e||this.options;var i={frequency:350,peak:1};this.inputNode=this.filterNode=s.context.createBiquadFilter(),this.filterNode.type=t,this.outputNode=o.context.createGain(),this.filterNode.connect(this.outputNode);for(var n in i)this[n]=e[n],this[n]=void 0===this[n]||null===this[n]?i[n]:this[n]}function i(){var e,t,i=s.context.sampleRate*this.time,n=o.context.createBuffer(2,i,s.context.sampleRate),a=n.getChannelData(0),r=n.getChannelData(1);for(t=0;i>t;t++)e=this.reverse?i-t:t,a[t]=(2*Math.random()-1)*Math.pow(1-e/i,this.decay),r[t]=(2*Math.random()-1)*Math.pow(1-e/i,this.decay);this.reverbNode.buffer&&(this.inputNode.disconnect(this.reverbNode),this.reverbNode.disconnect(this.wetGainNode),this.reverbNode=o.context.createConvolver(),this.inputNode.connect(this.reverbNode),this.reverbNode.connect(this.wetGainNode)),this.reverbNode.buffer=n}function n(e){for(var t=s.context.sampleRate,i=new Float32Array(t),n=Math.PI/180,o=0;t>o;o++){var a=2*o/t-1;i[o]=(3+e)*a*20*n/(Math.PI+e*Math.abs(a))}return i}var o={},s=o,a="object"==typeof module&&module.exports,r="function"==typeof define&&define.amd;a?module.exports=o:r?define([],o):e.Pizzicato=e.Pz=o;var c=e.AudioContext||e.webkitAudioContext;if(!c)return void console.error("No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.");o.context=new c;var h=o.context.createGain();h.connect(o.context.destination),o.Util={isString:function(e){return"[object String]"===toString.call(e)},isObject:function(e){return"[object Object]"===toString.call(e)},isFunction:function(e){return"[object Function]"===toString.call(e)},isNumber:function(e){return"[object Number]"===toString.call(e)&&e===+e},isArray:function(e){return"[object Array]"===toString.call(e)},isInRange:function(e,t,i){return s.Util.isNumber(e)&&s.Util.isNumber(t)&&s.Util.isNumber(i)?e>=t&&i>=e:!1},isBool:function(e){return"boolean"==typeof e},isOscillator:function(e){return e&&"[object OscillatorNode]"===e.toString()},isAudioBufferSourceNode:function(e){return e&&"[object AudioBufferSourceNode]"===e.toString()},isSound:function(e){return e instanceof s.Sound},isEffect:function(e){for(var t in o.Effects)if(e instanceof o.Effects[t])return!0;return!1},normalize:function(e,t,i){return s.Util.isNumber(e)&&s.Util.isNumber(t)&&s.Util.isNumber(i)?(i-t)*e/1+t:void 0},getDryLevel:function(e){return!s.Util.isNumber(e)||e>1||0>e?0:.5>=e?1:1-2*(e-.5)},getWetLevel:function(e){return!s.Util.isNumber(e)||e>1||0>e?0:e>=.5?1:1-2*(.5-e)}};var u=o.context.createGain(),d=Object.getPrototypeOf(Object.getPrototypeOf(u)),l=d.connect;d.connect=function(e){var t=s.Util.isEffect(e)?e.inputNode:e;return l.call(this,t),e},Object.defineProperty(o,"volume",{enumerable:!0,get:function(){return h.gain.value},set:function(e){s.Util.isInRange(e,0,1)&&h&&(h.gain.value=e)}}),Object.defineProperty(o,"masterGainNode",{enumerable:!1,get:function(){return h},set:function(e){console.error("Can't set the master gain node")}}),o.Events={on:function(e,t,i){if(e&&t){this._events=this._events||{};var n=this._events[e]||(this._events[e]=[]);n.push({callback:t,context:i||this,handler:this})}},trigger:function(e){if(e){var t,i,n,o;if(this._events=this._events||{},t=this._events[e]||(this._events[e]=[])){for(i=Math.max(0,arguments.length-1),n=[],o=0;i>o;o++)n[o]=arguments[o+1];for(o=0;o<t.length;o++)t[o].callback.apply(t[o].context,n)}}},off:function(e){e?this._events[e]=void 0:this._events={}}},o.Sound=function(e,t){function i(e){var t=["wave","file","input","script","sound"];if(e&&!d.isFunction(e)&&!d.isString(e)&&!d.isObject(e))return"Description type not supported. Initialize a sound using an object, a function or a string.";if(d.isObject(e)){if(!d.isString(e.source)||-1===t.indexOf(e.source))return"Specified source not supported. Sources can be wave, file, input or script";if(!("file"!==e.source||e.options&&e.options.path))return"A path is needed for sounds with a file source";if(!("script"!==e.source||e.options&&e.options.audioFunction))return"An audio function is needed for sounds with a script source"}}function n(e,t){e=e||{},this.getRawSourceNode=function(){var t=this.sourceNode?this.sourceNode.frequency.value:e.frequency,i=o.context.createOscillator();return i.type=e.type||"sine",i.frequency.value=t||440,i},this.sourceNode=this.getRawSourceNode(),this.sourceNode.gainSuccessor=s.context.createGain(),this.sourceNode.connect(this.sourceNode.gainSuccessor),d.isFunction(t)&&t()}function a(e,t){e=d.isArray(e)?e:[e];var i=new XMLHttpRequest;i.open("GET",e[0],!0),i.responseType="arraybuffer",i.onload=function(i){o.context.decodeAudioData(i.target.response,function(e){u.getRawSourceNode=function(){var t=o.context.createBufferSource();return t.loop=this.loop,t.buffer=e,t},d.isFunction(t)&&t()}.bind(u),function(i){return console.error("Error decoding audio file "+e[0]),e.length>1?(e.shift(),void a(e,t)):(i=i||new Error("Error decoding audio file "+e[0]),void(d.isFunction(t)&&t(i)))}.bind(u))},i.onreadystatechange=function(t){4===i.readyState&&200!==i.status&&console.error("Error while fetching "+e[0]+". "+i.statusText)},i.send()}function r(e,t){if(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia,!navigator.getUserMedia&&!navigator.mediaDevices.getUserMedia)return void console.error("Your browser does not support getUserMedia");var i=function(e){u.getRawSourceNode=function(){return o.context.createMediaStreamSource(e)},d.isFunction(t)&&t()}.bind(u),n=function(e){d.isFunction(t)&&t(e)};navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia({audio:!0}).then(i)["catch"](n):navigator.getUserMedia({audio:!0},i,n)}function c(e,t){var i=d.isFunction(e)?e:e.audioFunction,n=d.isObject(e)&&e.bufferSize?e.bufferSize:null;if(!n)try{o.context.createScriptProcessor()}catch(s){n=2048}this.getRawSourceNode=function(){var e=o.context.createScriptProcessor(n,1,1);return e.onaudioprocess=i,e}}function h(e,t){this.getRawSourceNode=e.sound.getRawSourceNode,e.sound.sourceNode&&s.Util.isOscillator(e.sound.sourceNode)&&(this.sourceNode=this.getRawSourceNode(),this.frequency=e.sound.frequency)}var u=this,d=o.Util,l=i(e),f=d.isObject(e)&&d.isObject(e.options),p=.04,v=.04;if(l)throw console.error(l),new Error("Error initializing Pizzicato Sound: "+l);this.detached=f&&e.options.detached,this.masterVolume=o.context.createGain(),this.fadeNode=o.context.createGain(),this.fadeNode.gain.value=0,this.detached||this.masterVolume.connect(o.masterGainNode),this.lastTimePlayed=0,this.effects=[],this.effectConnectors=[],this.playing=this.paused=!1,this.loop=f&&e.options.loop,this.attack=f&&d.isNumber(e.options.attack)?e.options.attack:p,this.volume=f&&d.isNumber(e.options.volume)?e.options.volume:1,f&&d.isNumber(e.options.release)?this.release=e.options.release:f&&d.isNumber(e.options.sustain)?(console.warn("'sustain' is deprecated. Use 'release' instead."),this.release=e.options.sustain):this.release=v,e?d.isString(e)?a.bind(this)(e,t):d.isFunction(e)?c.bind(this)(e,t):"file"===e.source?a.bind(this)(e.options.path,t):"wave"===e.source?n.bind(this)(e.options,t):"input"===e.source?r.bind(this)(e,t):"script"===e.source?c.bind(this)(e.options,t):"sound"===e.source&&h.bind(this)(e.options,t):n.bind(this)({},t)},o.Sound.prototype=Object.create(o.Events,{play:{enumerable:!0,value:function(e,t){this.playing||(s.Util.isNumber(t)||(t=this.offsetTime||0),s.Util.isNumber(e)||(e=0),this.playing=!0,this.paused=!1,this.sourceNode=this.getSourceNode(),this.applyAttack(),s.Util.isFunction(this.sourceNode.start)&&(this.lastTimePlayed=o.context.currentTime-t,this.sourceNode.start(s.context.currentTime+e,t)),this.trigger("play"))}},stop:{enumerable:!0,value:function(){(this.paused||this.playing)&&(this.paused=this.playing=!1,this.stopWithRelease(),this.offsetTime=0,this.trigger("stop"))}},pause:{enumerable:!0,value:function(){if(!this.paused&&this.playing){this.paused=!0,this.playing=!1,this.stopWithRelease();var e=s.context.currentTime-this.lastTimePlayed;this.sourceNode.buffer?this.offsetTime=e%(this.sourceNode.buffer.length/s.context.sampleRate):this.offsetTime=e,this.trigger("pause")}}},clone:{enumerable:!0,value:function(){for(var e=new o.Sound({source:"sound",options:{loop:this.loop,attack:this.attack,release:this.release,volume:this.volume,sound:this}}),t=0;t<this.effects.length;t++)e.addEffect(this.effects[t]);return e}},onEnded:{enumerable:!0,value:function(e){return function(){this.sourceNode&&this.sourceNode!==e||(this.playing&&this.stop(),this.paused||this.trigger("end"))}}},addEffect:{enumerable:!0,value:function(e){if(!s.Util.isEffect(e))return console.error("The object provided is not a Pizzicato effect."),this;this.effects.push(e);var t=this.effectConnectors.length>0?this.effectConnectors[this.effectConnectors.length-1]:this.fadeNode;t.disconnect(),t.connect(e);var i=s.context.createGain();return this.effectConnectors.push(i),e.connect(i),i.connect(this.masterVolume),this}},removeEffect:{enumerable:!0,value:function(e){var t=this.effects.indexOf(e);if(-1===t)return console.warn("Cannot remove effect that is not applied to this sound."),this;var i=this.playing;i&&this.pause();var n=0===t?this.fadeNode:this.effectConnectors[t-1];n.disconnect();var o=this.effectConnectors[t];o.disconnect(),e.disconnect(o),this.effectConnectors.splice(t,1),this.effects.splice(t,1);var s;return s=t>this.effects.length-1||0===this.effects.length?this.masterVolume:this.effects[t],n.connect(s),i&&this.play(),this}},connect:{enumerable:!0,value:function(e){return this.masterVolume.connect(e),this}},disconnect:{enumerable:!0,value:function(e){return this.masterVolume.disconnect(e),this}},connectEffects:{enumerable:!0,value:function(){for(var e=[],t=0;t<this.effects.length;t++){var i=t===this.effects.length-1,n=i?this.masterVolume:this.effects[t+1].inputNode;e[t]=s.context.createGain(),this.effects[t].outputNode.disconnect(this.effectConnectors[t]),this.effects[t].outputNode.connect(n)}}},volume:{enumerable:!0,get:function(){return this.masterVolume?this.masterVolume.gain.value:void 0},set:function(e){s.Util.isInRange(e,0,1)&&this.masterVolume&&(this.masterVolume.gain.value=e)}},frequency:{enumerable:!0,get:function(){return this.sourceNode&&s.Util.isOscillator(this.sourceNode)?this.sourceNode.frequency.value:null},set:function(e){this.sourceNode&&s.Util.isOscillator(this.sourceNode)&&(this.sourceNode.frequency.value=e)}},sustain:{enumerable:!0,get:function(){return console.warn("'sustain' is deprecated. Use 'release' instead."),this.release},set:function(e){console.warn("'sustain' is deprecated. Use 'release' instead."),s.Util.isInRange(e,0,10)&&(this.release=e)}},getSourceNode:{enumerable:!0,value:function(){if(this.sourceNode){var e=this.sourceNode;e.gainSuccessor.gain.setValueAtTime(e.gainSuccessor.gain.value,s.context.currentTime),e.gainSuccessor.gain.linearRampToValueAtTime(1e-4,s.context.currentTime+.2),setTimeout(function(){e.disconnect(),e.gainSuccessor.disconnect()},200)}var t=this.getRawSourceNode();return t.gainSuccessor=s.context.createGain(),t.connect(t.gainSuccessor),t.gainSuccessor.connect(this.fadeNode),this.fadeNode.connect(this.getInputNode()),s.Util.isAudioBufferSourceNode(t)&&(t.onended=this.onEnded(t).bind(this)),t}},getInputNode:{enumerable:!0,value:function(){return this.effects.length>0?this.effects[0].inputNode:this.masterVolume}},applyAttack:{enumerable:!1,value:function(){this.fadeNode.gain.value;if(this.fadeNode.gain.cancelScheduledValues(s.context.currentTime),!this.attack)return void this.fadeNode.gain.setTargetAtTime(1,s.context.currentTime,.001);var e=navigator.userAgent.toLowerCase().indexOf("firefox")>-1,t=this.attack;e||(t=(1-this.fadeNode.gain.value)*this.attack),this.fadeNode.gain.setTargetAtTime(1,s.context.currentTime,2*t)}},stopWithRelease:{enumerable:!1,value:function(e){var t=this.sourceNode,i=function(){return s.Util.isFunction(t.stop)?t.stop(0):t.disconnect()};this.fadeNode.gain.value;if(this.fadeNode.gain.cancelScheduledValues(s.context.currentTime),!this.release)return this.fadeNode.gain.setTargetAtTime(0,s.context.currentTime,.001),void i();var n=navigator.userAgent.toLowerCase().indexOf("firefox")>-1,o=this.release;n||(o=this.fadeNode.gain.value*this.release),this.fadeNode.gain.setTargetAtTime(1e-5,s.context.currentTime,o/5),window.setTimeout(function(){i()},1e3*o)}}}),o.Group=function(e){e=e||[],this.mergeGainNode=s.context.createGain(),this.masterVolume=s.context.createGain(),this.sounds=[],this.effects=[],this.effectConnectors=[],this.mergeGainNode.connect(this.masterVolume),this.masterVolume.connect(s.masterGainNode);for(var t=0;t<e.length;t++)this.addSound(e[t])},o.Group.prototype=Object.create(s.Events,{connect:{enumerable:!0,value:function(e){return this.masterVolume.connect(e),this}},disconnect:{enumerable:!0,value:function(e){return this.masterVolume.disconnect(e),this}},addSound:{enumerable:!0,value:function(e){return s.Util.isSound(e)?this.sounds.indexOf(e)>-1?void console.warn("The Pizzicato.Sound object was already added to this group"):e.detached?void console.warn("Groups do not support detached sounds. You can manually create an audio graph to group detached sounds together."):(e.disconnect(s.masterGainNode),e.connect(this.mergeGainNode),void this.sounds.push(e)):void console.error("You can only add Pizzicato.Sound objects")}},removeSound:{enumerable:!0,value:function(e){var t=this.sounds.indexOf(e);return-1===t?void console.warn("Cannot remove a sound that is not part of this group."):(e.disconnect(this.mergeGainNode),e.connect(s.masterGainNode),void this.sounds.splice(t,1))}},volume:{enumerable:!0,get:function(){return this.masterVolume?this.masterVolume.gain.value:void 0},set:function(e){s.Util.isInRange(e,0,1)&&(this.masterVolume.gain.value=e)}},play:{enumerable:!0,value:function(){for(var e=0;e<this.sounds.length;e++)this.sounds[e].play();this.trigger("play")}},stop:{enumerable:!0,value:function(){for(var e=0;e<this.sounds.length;e++)this.sounds[e].stop();this.trigger("stop")}},pause:{enumerable:!0,value:function(){for(var e=0;e<this.sounds.length;e++)this.sounds[e].pause();this.trigger("pause")}},addEffect:{enumerable:!0,value:function(e){if(!s.Util.isEffect(e))return console.error("The object provided is not a Pizzicato effect."),this;this.effects.push(e);var t=this.effectConnectors.length>0?this.effectConnectors[this.effectConnectors.length-1]:this.mergeGainNode;t.disconnect(),t.connect(e);var i=s.context.createGain();return this.effectConnectors.push(i),e.connect(i),i.connect(this.masterVolume),this}},removeEffect:{enumerable:!0,value:function(e){var t=this.effects.indexOf(e);if(-1===t)return console.warn("Cannot remove effect that is not applied to this group."),this;var i=0===t?this.mergeGainNode:this.effectConnectors[t-1];i.disconnect();var n=this.effectConnectors[t];n.disconnect(),e.disconnect(n),this.effectConnectors.splice(t,1),this.effects.splice(t,1);var o;return o=t>this.effects.length-1||0===this.effects.length?this.masterVolume:this.effects[t],i.connect(o),this}}}),o.Effects={};var f=Object.create(null,{connect:{enumerable:!0,value:function(e){return this.outputNode.connect(e),this}},disconnect:{enumerable:!0,value:function(e){return this.outputNode.disconnect(e),this}}});o.Effects.Delay=function(e){this.options={},e=e||this.options;var t={feedback:.5,time:.3,mix:.5};this.inputNode=o.context.createGain(),this.outputNode=o.context.createGain(),this.dryGainNode=o.context.createGain(),this.wetGainNode=o.context.createGain(),this.feedbackGainNode=o.context.createGain(),this.delayNode=o.context.createDelay(),this.inputNode.connect(this.dryGainNode),this.dryGainNode.connect(this.outputNode),this.delayNode.connect(this.feedbackGainNode),this.feedbackGainNode.connect(this.delayNode),this.inputNode.connect(this.delayNode),this.delayNode.connect(this.wetGainNode),this.wetGainNode.connect(this.outputNode);for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]},o.Effects.Delay.prototype=Object.create(f,{mix:{enumerable:!0,get:function(){return this.options.mix},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.mix=e,this.dryGainNode.gain.value=o.Util.getDryLevel(this.mix),this.wetGainNode.gain.value=o.Util.getWetLevel(this.mix))}},time:{enumerable:!0,get:function(){return this.options.time},set:function(e){s.Util.isInRange(e,0,180)&&(this.options.time=e,this.delayNode.delayTime.value=e)}},feedback:{enumerable:!0,get:function(){return this.options.feedback},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.feedback=parseFloat(e,10),this.feedbackGainNode.gain.value=this.feedback)}}}),o.Effects.Compressor=function(e){this.options={},e=e||this.options;var t={threshold:-24,knee:30,attack:.003,release:.25,ratio:12};this.inputNode=this.compressorNode=o.context.createDynamicsCompressor(),this.outputNode=o.context.createGain(),this.compressorNode.connect(this.outputNode);for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]},o.Effects.Compressor.prototype=Object.create(f,{threshold:{enumerable:!0,get:function(){return this.compressorNode.threshold.value},set:function(e){o.Util.isInRange(e,-100,0)&&(this.compressorNode.threshold.value=e)}},knee:{enumerable:!0,get:function(){return this.compressorNode.knee.value},set:function(e){o.Util.isInRange(e,0,40)&&(this.compressorNode.knee.value=e)}},attack:{enumerable:!0,get:function(){return this.compressorNode.attack.value},set:function(e){o.Util.isInRange(e,0,1)&&(this.compressorNode.attack.value=e)}},release:{enumerable:!0,get:function(){return this.compressorNode.release.value},set:function(e){o.Util.isInRange(e,0,1)&&(this.compressorNode.release.value=e)}},ratio:{enumerable:!0,get:function(){return this.compressorNode.ratio.value},set:function(e){o.Util.isInRange(e,1,20)&&(this.compressorNode.ratio.value=e)}},getCurrentGainReduction:function(){return this.compressorNode.reduction}}),o.Effects.LowPassFilter=function(e){t.call(this,e,"lowpass")},o.Effects.HighPassFilter=function(e){t.call(this,e,"highpass")};var p=Object.create(f,{frequency:{enumerable:!0,get:function(){return this.filterNode.frequency.value},set:function(e){o.Util.isInRange(e,10,22050)&&(this.filterNode.frequency.value=e)}},peak:{enumerable:!0,get:function(){return this.filterNode.Q.value},set:function(e){o.Util.isInRange(e,1e-4,1e3)&&(this.filterNode.Q.value=e)}}});o.Effects.LowPassFilter.prototype=p,o.Effects.HighPassFilter.prototype=p,o.Effects.Distortion=function(e){this.options={},e=e||this.options;var t={gain:.5};this.waveShaperNode=o.context.createWaveShaper(),this.inputNode=this.outputNode=this.waveShaperNode;for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]},o.Effects.Distortion.prototype=Object.create(f,{gain:{enumerable:!0,get:function(){return this.options.gain},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.gain=e,this.adjustGain())}},adjustGain:{writable:!1,configurable:!1,enumerable:!1,value:function(){for(var e,t=s.Util.isNumber(this.options.gain)?parseInt(100*this.options.gain,10):50,i=44100,n=new Float32Array(i),o=Math.PI/180,a=0;i>a;++a)e=2*a/i-1,n[a]=(3+t)*e*20*o/(Math.PI+t*Math.abs(e));this.waveShaperNode.curve=n}}}),o.Effects.Flanger=function(e){this.options={},e=e||this.options;var t={time:.45,speed:.2,depth:.1,feedback:.1,mix:.5};this.inputNode=o.context.createGain(),this.outputNode=o.context.createGain(),this.inputFeedbackNode=o.context.createGain(),this.wetGainNode=o.context.createGain(),this.dryGainNode=o.context.createGain(),this.delayNode=o.context.createDelay(),this.oscillatorNode=o.context.createOscillator(),this.gainNode=o.context.createGain(),this.feedbackNode=o.context.createGain(),this.oscillatorNode.type="sine",this.inputNode.connect(this.inputFeedbackNode),this.inputNode.connect(this.dryGainNode),this.inputFeedbackNode.connect(this.delayNode),this.inputFeedbackNode.connect(this.wetGainNode),this.delayNode.connect(this.wetGainNode),this.delayNode.connect(this.feedbackNode),this.feedbackNode.connect(this.inputFeedbackNode),this.oscillatorNode.connect(this.gainNode),this.gainNode.connect(this.delayNode.delayTime),this.dryGainNode.connect(this.outputNode),this.wetGainNode.connect(this.outputNode),this.oscillatorNode.start(0);for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]},o.Effects.Flanger.prototype=Object.create(f,{time:{enumberable:!0,get:function(){return this.options.time},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.time=e,this.delayNode.delayTime.value=s.Util.normalize(e,.001,.02))}},speed:{enumberable:!0,get:function(){return this.options.speed},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.speed=e,this.oscillatorNode.frequency.value=s.Util.normalize(e,.5,5))}},depth:{enumberable:!0,get:function(){return this.options.depth},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.depth=e,this.gainNode.gain.value=s.Util.normalize(e,5e-4,.005))}},feedback:{enumberable:!0,get:function(){return this.options.feedback},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.feedback=e,this.feedbackNode.gain.value=s.Util.normalize(e,0,.8))}},mix:{enumberable:!0,get:function(){return this.options.mix},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.mix=e,this.dryGainNode.gain.value=o.Util.getDryLevel(this.mix),this.wetGainNode.gain.value=o.Util.getWetLevel(this.mix))}}}),o.Effects.StereoPanner=function(e){this.options={},e=e||this.options;var t={pan:0};this.inputNode=o.context.createGain(),this.outputNode=o.context.createGain(),o.context.createStereoPanner?(this.pannerNode=o.context.createStereoPanner(),this.inputNode.connect(this.pannerNode),this.pannerNode.connect(this.outputNode)):o.context.createPanner?(console.warn("Your browser does not support the StereoPannerNode. Will use PannerNode instead."),this.pannerNode=o.context.createPanner(),this.pannerNode.type="equalpower",this.inputNode.connect(this.pannerNode),this.pannerNode.connect(this.outputNode)):(console.warn("Your browser does not support the Panner effect."),this.inputNode.connect(this.outputNode));for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]},o.Effects.StereoPanner.prototype=Object.create(f,{pan:{enumerable:!0,get:function(){return this.options.pan},set:function(e){if(s.Util.isInRange(e,-1,1)&&(this.options.pan=e,this.pannerNode)){var t=this.pannerNode.toString().indexOf("StereoPannerNode")>-1;t?this.pannerNode.pan.value=e:this.pannerNode.setPosition(e,0,1-Math.abs(e))}}}}),o.Effects.Convolver=function(e,t){this.options={},e=e||this.options;var i=this,n=new XMLHttpRequest,a={mix:.5};this.callback=t,this.inputNode=o.context.createGain(),this.convolverNode=o.context.createConvolver(),this.outputNode=o.context.createGain(),this.wetGainNode=o.context.createGain(),this.dryGainNode=o.context.createGain(),this.inputNode.connect(this.convolverNode),this.convolverNode.connect(this.wetGainNode),this.inputNode.connect(this.dryGainNode),this.dryGainNode.connect(this.outputNode),this.wetGainNode.connect(this.outputNode);for(var r in a)this[r]=e[r],this[r]=void 0===this[r]||null===this[r]?a[r]:this[r];return e.impulse?(n.open("GET",e.impulse,!0),n.responseType="arraybuffer",n.onload=function(e){var t=e.target.response;o.context.decodeAudioData(t,function(e){i.convolverNode.buffer=e,i.callback&&s.Util.isFunction(i.callback)&&i.callback()},function(e){e=e||new Error("Error decoding impulse file"),i.callback&&s.Util.isFunction(i.callback)&&i.callback(e)})},n.onreadystatechange=function(t){4===n.readyState&&200!==n.status&&console.error("Error while fetching "+e.impulse+". "+n.statusText)},void n.send()):void console.error("No impulse file specified.")},o.Effects.Convolver.prototype=Object.create(f,{mix:{enumerable:!0,get:function(){return this.options.mix},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.mix=e,this.dryGainNode.gain.value=o.Util.getDryLevel(this.mix),this.wetGainNode.gain.value=o.Util.getWetLevel(this.mix))}}}),o.Effects.PingPongDelay=function(e){this.options={},e=e||this.options;var t={feedback:.5,time:.3,mix:.5};this.inputNode=o.context.createGain(),this.outputNode=o.context.createGain(),this.delayNodeLeft=o.context.createDelay(),this.delayNodeRight=o.context.createDelay(),this.dryGainNode=o.context.createGain(),this.wetGainNode=o.context.createGain(),this.feedbackGainNode=o.context.createGain(),this.channelMerger=o.context.createChannelMerger(2),this.inputNode.connect(this.dryGainNode),this.dryGainNode.connect(this.outputNode),this.delayNodeLeft.connect(this.channelMerger,0,0),this.delayNodeRight.connect(this.channelMerger,0,1),this.delayNodeLeft.connect(this.delayNodeRight),this.feedbackGainNode.connect(this.delayNodeLeft),this.delayNodeRight.connect(this.feedbackGainNode),this.inputNode.connect(this.feedbackGainNode),this.channelMerger.connect(this.wetGainNode),this.wetGainNode.connect(this.outputNode);for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]},o.Effects.PingPongDelay.prototype=Object.create(f,{mix:{enumerable:!0,get:function(){return this.options.mix},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.mix=e,this.dryGainNode.gain.value=o.Util.getDryLevel(this.mix),this.wetGainNode.gain.value=o.Util.getWetLevel(this.mix))}},time:{enumerable:!0,get:function(){return this.options.time},set:function(e){s.Util.isInRange(e,0,180)&&(this.options.time=e,this.delayNodeLeft.delayTime.value=e,this.delayNodeRight.delayTime.value=e)}},feedback:{enumerable:!0,get:function(){return this.options.feedback},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.feedback=parseFloat(e,10),this.feedbackGainNode.gain.value=this.feedback)}}}),o.Effects.Reverb=function(e){this.options={},e=e||this.options;var t={mix:.5,time:.01,decay:.01,reverse:!1};this.inputNode=o.context.createGain(),this.reverbNode=o.context.createConvolver(),this.outputNode=o.context.createGain(),this.wetGainNode=o.context.createGain(),this.dryGainNode=o.context.createGain(),this.inputNode.connect(this.reverbNode),this.reverbNode.connect(this.wetGainNode),this.inputNode.connect(this.dryGainNode),this.dryGainNode.connect(this.outputNode),this.wetGainNode.connect(this.outputNode);for(var n in t)this[n]=e[n],this[n]=void 0===this[n]||null===this[n]?t[n]:this[n];i.bind(this)()},o.Effects.Reverb.prototype=Object.create(f,{mix:{enumerable:!0,get:function(){return this.options.mix},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.mix=e,this.dryGainNode.gain.value=o.Util.getDryLevel(this.mix),this.wetGainNode.gain.value=o.Util.getWetLevel(this.mix))}},time:{enumerable:!0,get:function(){return this.options.time},set:function(e){s.Util.isInRange(e,1e-4,10)&&(this.options.time=e,i.bind(this)())}},decay:{enumerable:!0,get:function(){return this.options.decay},set:function(e){s.Util.isInRange(e,1e-4,10)&&(this.options.decay=e,i.bind(this)())}},reverse:{enumerable:!0,get:function(){return this.options.reverse},set:function(e){s.Util.isBool(e)&&(this.options.reverse=e,i.bind(this)())}}}),o.Effects.Tremolo=function(e){this.options={},e=e||this.options;var t={speed:4,depth:1,mix:.8};this.inputNode=o.context.createGain(),this.outputNode=o.context.createGain(),this.dryGainNode=o.context.createGain(),this.wetGainNode=o.context.createGain(),this.tremoloGainNode=o.context.createGain(),this.tremoloGainNode.gain.value=0,this.lfoNode=o.context.createOscillator(),this.shaperNode=o.context.createWaveShaper(),this.shaperNode.curve=new Float32Array([0,1]),this.shaperNode.connect(this.tremoloGainNode.gain),this.inputNode.connect(this.dryGainNode),this.dryGainNode.connect(this.outputNode),this.lfoNode.connect(this.shaperNode),this.lfoNode.type="sine",this.lfoNode.start(0),this.inputNode.connect(this.tremoloGainNode),this.tremoloGainNode.connect(this.wetGainNode),this.wetGainNode.connect(this.outputNode);for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]},o.Effects.Tremolo.prototype=Object.create(f,{mix:{enumerable:!0,get:function(){return this.options.mix},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.mix=e,this.dryGainNode.gain.value=o.Util.getDryLevel(this.mix),this.wetGainNode.gain.value=o.Util.getWetLevel(this.mix))}},speed:{enumerable:!0,get:function(){return this.options.speed},set:function(e){s.Util.isInRange(e,0,20)&&(this.options.speed=e,this.lfoNode.frequency.value=e)}},depth:{enumerable:!0,get:function(){return this.options.depth},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.depth=e,this.shaperNode.curve=new Float32Array([1-e,1]))}}}),o.Effects.DubDelay=function(e){this.options={},e=e||this.options;var t={feedback:.6,time:.7,mix:.5,cutoff:700};this.inputNode=o.context.createGain(),this.outputNode=o.context.createGain(),this.dryGainNode=o.context.createGain(),this.wetGainNode=o.context.createGain(),this.feedbackGainNode=o.context.createGain(),this.delayNode=o.context.createDelay(),this.bqFilterNode=o.context.createBiquadFilter(),this.inputNode.connect(this.dryGainNode),this.dryGainNode.connect(this.outputNode),this.inputNode.connect(this.wetGainNode),this.inputNode.connect(this.feedbackGainNode),this.feedbackGainNode.connect(this.bqFilterNode),this.bqFilterNode.connect(this.delayNode),this.delayNode.connect(this.feedbackGainNode),this.delayNode.connect(this.wetGainNode),this.wetGainNode.connect(this.outputNode);for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]},o.Effects.DubDelay.prototype=Object.create(f,{mix:{enumerable:!0,get:function(){return this.options.mix},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.mix=e,this.dryGainNode.gain.value=o.Util.getDryLevel(this.mix),this.wetGainNode.gain.value=o.Util.getWetLevel(this.mix))}},time:{enumerable:!0,get:function(){return this.options.time},set:function(e){s.Util.isInRange(e,0,180)&&(this.options.time=e,this.delayNode.delayTime.value=e)}},feedback:{enumerable:!0,get:function(){return this.options.feedback},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.feedback=parseFloat(e,10),this.feedbackGainNode.gain.value=this.feedback)}},cutoff:{enumerable:!0,get:function(){return this.options.cutoff},set:function(e){s.Util.isInRange(e,0,4e3)&&(this.options.cutoff=e,this.bqFilterNode.frequency.value=this.cutoff)}}}),o.Effects.RingModulator=function(e){this.options={},e=e||this.options;var t={speed:30,distortion:1,mix:.5};this.inputNode=o.context.createGain(),this.outputNode=o.context.createGain(),this.dryGainNode=o.context.createGain(),this.wetGainNode=o.context.createGain(),this.vIn=o.context.createOscillator(),this.vIn.start(0),this.vInGain=o.context.createGain(),this.vInGain.gain.value=.5,this.vInInverter1=o.context.createGain(),this.vInInverter1.gain.value=-1,this.vInInverter2=o.context.createGain(),this.vInInverter2.gain.value=-1,this.vInDiode1=new v(o.context),this.vInDiode2=new v(o.context),this.vInInverter3=o.context.createGain(),this.vInInverter3.gain.value=-1,this.vcInverter1=o.context.createGain(),this.vcInverter1.gain.value=-1,this.vcDiode3=new v(o.context),this.vcDiode4=new v(o.context),this.outGain=o.context.createGain(),this.outGain.gain.value=3,this.compressor=o.context.createDynamicsCompressor(),this.compressor.threshold.value=-24,this.compressor.ratio.value=16,this.inputNode.connect(this.dryGainNode),this.dryGainNode.connect(this.outputNode),this.inputNode.connect(this.vcInverter1),this.inputNode.connect(this.vcDiode4.node),this.vcInverter1.connect(this.vcDiode3.node),this.vIn.connect(this.vInGain),this.vInGain.connect(this.vInInverter1),this.vInGain.connect(this.vcInverter1),this.vInGain.connect(this.vcDiode4.node),this.vInInverter1.connect(this.vInInverter2),this.vInInverter1.connect(this.vInDiode2.node),this.vInInverter2.connect(this.vInDiode1.node),this.vInDiode1.connect(this.vInInverter3),this.vInDiode2.connect(this.vInInverter3),this.vInInverter3.connect(this.compressor),this.vcDiode3.connect(this.compressor),this.vcDiode4.connect(this.compressor),this.compressor.connect(this.outGain),
this.outGain.connect(this.wetGainNode),this.wetGainNode.connect(this.outputNode);for(var i in t)this[i]=e[i],this[i]=void 0===this[i]||null===this[i]?t[i]:this[i]};var v=function(e){this.context=e,this.node=this.context.createWaveShaper(),this.vb=.2,this.vl=.4,this.h=1,this.setCurve()};return v.prototype.setDistortion=function(e){return this.h=e,this.setCurve()},v.prototype.setCurve=function(){var e,t,i,n,o,s,a,r;for(t=1024,o=new Float32Array(t),e=s=0,a=o.length;a>=0?a>s:s>a;e=a>=0?++s:--s)i=(e-t/2)/(t/2),i=Math.abs(i),n=i<=this.vb?0:this.vb<i&&i<=this.vl?this.h*(Math.pow(i-this.vb,2)/(2*this.vl-2*this.vb)):this.h*i-this.h*this.vl+this.h*(Math.pow(this.vl-this.vb,2)/(2*this.vl-2*this.vb)),o[e]=n;return r=this.node.curve=o},v.prototype.connect=function(e){return this.node.connect(e)},o.Effects.RingModulator.prototype=Object.create(f,{mix:{enumerable:!0,get:function(){return this.options.mix},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.mix=e,this.dryGainNode.gain.value=o.Util.getDryLevel(this.mix),this.wetGainNode.gain.value=o.Util.getWetLevel(this.mix))}},speed:{enumerable:!0,get:function(){return this.options.speed},set:function(e){s.Util.isInRange(e,0,2e3)&&(this.options.speed=e,this.vIn.frequency.value=e)}},distortion:{enumerable:!0,get:function(){return this.options.distortion},set:function(e){if(s.Util.isInRange(e,.2,50)){this.options.distortion=parseFloat(e,10);for(var t=[this.vInDiode1,this.vInDiode2,this.vcDiode3,this.vcDiode4],i=0,n=t.length;n>i;i++)t[i].setDistortion(e)}}}}),o.Effects.Quadrafuzz=function(e){this.options={},e=e||this.options;var t={lowGain:.6,midLowGain:.8,midHighGain:.5,highGain:.6};this.inputNode=s.context.createGain(),this.outputNode=s.context.createGain(),this.dryGainNode=s.context.createGain(),this.wetGainNode=s.context.createGain(),this.lowpassLeft=s.context.createBiquadFilter(),this.lowpassLeft.type="lowpass",this.lowpassLeft.frequency.value=147,this.lowpassLeft.Q.value=.7071,this.bandpass1Left=s.context.createBiquadFilter(),this.bandpass1Left.type="bandpass",this.bandpass1Left.frequency.value=587,this.bandpass1Left.Q.value=.7071,this.bandpass2Left=s.context.createBiquadFilter(),this.bandpass2Left.type="bandpass",this.bandpass2Left.frequency.value=2490,this.bandpass2Left.Q.value=.7071,this.highpassLeft=s.context.createBiquadFilter(),this.highpassLeft.type="highpass",this.highpassLeft.frequency.value=4980,this.highpassLeft.Q.value=.7071,this.overdrives=[];for(var i=0;4>i;i++)this.overdrives[i]=s.context.createWaveShaper(),this.overdrives[i].curve=n();this.inputNode.connect(this.wetGainNode),this.inputNode.connect(this.dryGainNode),this.dryGainNode.connect(this.outputNode);var o=[this.lowpassLeft,this.bandpass1Left,this.bandpass2Left,this.highpassLeft];for(i=0;i<o.length;i++)this.wetGainNode.connect(o[i]),o[i].connect(this.overdrives[i]),this.overdrives[i].connect(this.outputNode);for(var a in t)this[a]=e[a],this[a]=void 0===this[a]||null===this[a]?t[a]:this[a]},o.Effects.Quadrafuzz.prototype=Object.create(f,{lowGain:{enumerable:!0,get:function(){return this.options.lowGain},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.lowGain=e,this.overdrives[0].curve=n(s.Util.normalize(this.lowGain,0,150)))}},midLowGain:{enumerable:!0,get:function(){return this.options.midLowGain},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.midLowGain=e,this.overdrives[1].curve=n(s.Util.normalize(this.midLowGain,0,150)))}},midHighGain:{enumerable:!0,get:function(){return this.options.midHighGain},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.midHighGain=e,this.overdrives[2].curve=n(s.Util.normalize(this.midHighGain,0,150)))}},highGain:{enumerable:!0,get:function(){return this.options.highGain},set:function(e){s.Util.isInRange(e,0,1)&&(this.options.highGain=e,this.overdrives[3].curve=n(s.Util.normalize(this.highGain,0,150)))}}}),o}("undefined"!=typeof window?window:global);
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
(function (process){(function (){
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.ROT = {});
})(this, function (exports) {
  'use strict';
  /**
   * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baag├╕e.
   * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
   */

  var FRAC = 2.3283064365386963e-10;
  /* 2^-32 */

  var RNG =
  /*#__PURE__*/
  function () {
    function RNG() {
      this._seed = 0;
      this._s0 = 0;
      this._s1 = 0;
      this._s2 = 0;
      this._c = 0;
    }

    var _proto = RNG.prototype;

    _proto.getSeed = function getSeed() {
      return this._seed;
    };
    /**
     * Seed the number generator
     */


    _proto.setSeed = function setSeed(seed) {
      seed = seed < 1 ? 1 / seed : seed;
      this._seed = seed;
      this._s0 = (seed >>> 0) * FRAC;
      seed = seed * 69069 + 1 >>> 0;
      this._s1 = seed * FRAC;
      seed = seed * 69069 + 1 >>> 0;
      this._s2 = seed * FRAC;
      this._c = 1;
      return this;
    };
    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */


    _proto.getUniform = function getUniform() {
      var t = 2091639 * this._s0 + this._c * FRAC;
      this._s0 = this._s1;
      this._s1 = this._s2;
      this._c = t | 0;
      this._s2 = t - this._c;
      return this._s2;
    };
    /**
     * @param lowerBound The lower end of the range to return a value from, inclusive
     * @param upperBound The upper end of the range to return a value from, inclusive
     * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
     */


    _proto.getUniformInt = function getUniformInt(lowerBound, upperBound) {
      var max = Math.max(lowerBound, upperBound);
      var min = Math.min(lowerBound, upperBound);
      return Math.floor(this.getUniform() * (max - min + 1)) + min;
    };
    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     */


    _proto.getNormal = function getNormal(mean, stddev) {
      if (mean === void 0) {
        mean = 0;
      }

      if (stddev === void 0) {
        stddev = 1;
      }

      var u, v, r;

      do {
        u = 2 * this.getUniform() - 1;
        v = 2 * this.getUniform() - 1;
        r = u * u + v * v;
      } while (r > 1 || r == 0);

      var gauss = u * Math.sqrt(-2 * Math.log(r) / r);
      return mean + gauss * stddev;
    };
    /**
     * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
     */


    _proto.getPercentage = function getPercentage() {
      return 1 + Math.floor(this.getUniform() * 100);
    };
    /**
     * @returns Randomly picked item, null when length=0
     */


    _proto.getItem = function getItem(array) {
      if (!array.length) {
        return null;
      }

      return array[Math.floor(this.getUniform() * array.length)];
    };
    /**
     * @returns New array with randomized items
     */


    _proto.shuffle = function shuffle(array) {
      var result = [];
      var clone = array.slice();

      while (clone.length) {
        var _index = clone.indexOf(this.getItem(clone));

        result.push(clone.splice(_index, 1)[0]);
      }

      return result;
    };
    /**
     * @param data key=whatever, value=weight (relative probability)
     * @returns whatever
     */


    _proto.getWeightedValue = function getWeightedValue(data) {
      var total = 0;

      for (var _id in data) {
        total += data[_id];
      }

      var random = this.getUniform() * total;
      var id,
          part = 0;

      for (id in data) {
        part += data[id];

        if (random < part) {
          return id;
        }
      } // If by some floating-point annoyance we have
      // random >= total, just return the last id.


      return id;
    };
    /**
     * Get RNG state. Useful for storing the state and re-setting it via setState.
     * @returns Internal state
     */


    _proto.getState = function getState() {
      return [this._s0, this._s1, this._s2, this._c];
    };
    /**
     * Set a previously retrieved state.
     */


    _proto.setState = function setState(state) {
      this._s0 = state[0];
      this._s1 = state[1];
      this._s2 = state[2];
      this._c = state[3];
      return this;
    };
    /**
     * Returns a cloned RNG
     */


    _proto.clone = function clone() {
      var clone = new RNG();
      return clone.setState(this.getState());
    };

    return RNG;
  }();

  var RNG$1 = new RNG().setSeed(Date.now());
  /**
   * @class Abstract display backend module
   * @private
   */

  var Backend =
  /*#__PURE__*/
  function () {
    function Backend() {}

    var _proto2 = Backend.prototype;

    _proto2.getContainer = function getContainer() {
      return null;
    };

    _proto2.setOptions = function setOptions(options) {
      this._options = options;
    };

    return Backend;
  }();

  var Canvas =
  /*#__PURE__*/
  function (_Backend) {
    _inheritsLoose(Canvas, _Backend);

    function Canvas() {
      var _this;

      _this = _Backend.call(this) || this;
      _this._ctx = document.createElement("canvas").getContext("2d");
      return _this;
    }

    var _proto3 = Canvas.prototype;

    _proto3.schedule = function schedule(cb) {
      requestAnimationFrame(cb);
    };

    _proto3.getContainer = function getContainer() {
      return this._ctx.canvas;
    };

    _proto3.setOptions = function setOptions(opts) {
      _Backend.prototype.setOptions.call(this, opts);

      var style = opts.fontStyle ? opts.fontStyle + " " : "";
      var font = style + " " + opts.fontSize + "px " + opts.fontFamily;
      this._ctx.font = font;

      this._updateSize();

      this._ctx.font = font;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";
    };

    _proto3.clear = function clear() {
      this._ctx.fillStyle = this._options.bg;

      this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    };

    _proto3.eventToPosition = function eventToPosition(x, y) {
      var canvas = this._ctx.canvas;
      var rect = canvas.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
      x *= canvas.width / rect.width;
      y *= canvas.height / rect.height;

      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
        return [-1, -1];
      }

      return this._normalizedEventToPosition(x, y);
    };

    return Canvas;
  }(Backend);
  /**
   * Always positive modulus
   * @param x Operand
   * @param n Modulus
   * @returns x modulo n
   */


  function mod(x, n) {
    return (x % n + n) % n;
  }

  function clamp(val, min, max) {
    if (min === void 0) {
      min = 0;
    }

    if (max === void 0) {
      max = 1;
    }

    if (val < min) return min;
    if (val > max) return max;
    return val;
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  }
  /**
   * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
   * @param {string} template
   * @param {any} [argv]
   */


  function format(template) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var map = format.map;

    var replacer = function replacer(match, group1, group2, index) {
      if (template.charAt(index - 1) == "%") {
        return match.substring(1);
      }

      if (!args.length) {
        return match;
      }

      var obj = args[0];
      var group = group1 || group2;
      var parts = group.split(",");
      var name = parts.shift() || "";
      var method = map[name.toLowerCase()];

      if (!method) {
        return match;
      }

      obj = args.shift();
      var replaced = obj[method].apply(obj, parts);
      var first = name.charAt(0);

      if (first != first.toLowerCase()) {
        replaced = capitalize(replaced);
      }

      return replaced;
    };

    return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
  }

  format.map = {
    "s": "toString"
  };
  var util =
  /*#__PURE__*/
  Object.freeze({
    mod: mod,
    clamp: clamp,
    capitalize: capitalize,
    format: format
  });
  /**
   * @class Hexagonal backend
   * @private
   */

  var Hex =
  /*#__PURE__*/
  function (_Canvas) {
    _inheritsLoose(Hex, _Canvas);

    function Hex() {
      var _this2;

      _this2 = _Canvas.call(this) || this;
      _this2._spacingX = 0;
      _this2._spacingY = 0;
      _this2._hexSize = 0;
      return _this2;
    }

    var _proto4 = Hex.prototype;

    _proto4.draw = function draw(data, clearBefore) {
      var x = data[0],
          y = data[1],
          ch = data[2],
          fg = data[3],
          bg = data[4];
      var px = [(x + 1) * this._spacingX, y * this._spacingY + this._hexSize];

      if (this._options.transpose) {
        px.reverse();
      }

      if (clearBefore) {
        this._ctx.fillStyle = bg;

        this._fill(px[0], px[1]);
      }

      if (!ch) {
        return;
      }

      this._ctx.fillStyle = fg;
      var chars = [].concat(ch);

      for (var i = 0; i < chars.length; i++) {
        this._ctx.fillText(chars[i], px[0], Math.ceil(px[1]));
      }
    };

    _proto4.computeSize = function computeSize(availWidth, availHeight) {
      if (this._options.transpose) {
        availWidth += availHeight;
        availHeight = availWidth - availHeight;
        availWidth -= availHeight;
      }

      var width = Math.floor(availWidth / this._spacingX) - 1;
      var height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
      return [width, height];
    };

    _proto4.computeFontSize = function computeFontSize(availWidth, availHeight) {
      if (this._options.transpose) {
        availWidth += availHeight;
        availHeight = availWidth - availHeight;
        availWidth -= availHeight;
      }

      var hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
      var hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
      var hexSize = Math.min(hexSizeWidth, hexSizeHeight); // compute char ratio

      var oldFont = this._ctx.font;
      this._ctx.font = "100px " + this._options.fontFamily;
      var width = Math.ceil(this._ctx.measureText("W").width);
      this._ctx.font = oldFont;
      var ratio = width / 100;
      hexSize = Math.floor(hexSize) + 1; // closest larger hexSize
      // FIXME char size computation does not respect transposed hexes

      var fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3))); // closest smaller fontSize

      return Math.ceil(fontSize) - 1;
    };

    _proto4._normalizedEventToPosition = function _normalizedEventToPosition(x, y) {
      var nodeSize;

      if (this._options.transpose) {
        x += y;
        y = x - y;
        x -= y;
        nodeSize = this._ctx.canvas.width;
      } else {
        nodeSize = this._ctx.canvas.height;
      }

      var size = nodeSize / this._options.height;
      y = Math.floor(y / size);

      if (mod(y, 2)) {
        /* odd row */
        x -= this._spacingX;
        x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
      } else {
        x = 2 * Math.floor(x / (2 * this._spacingX));
      }

      return [x, y];
    };
    /**
     * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
     */


    _proto4._fill = function _fill(cx, cy) {
      var a = this._hexSize;
      var b = this._options.border;
      var ctx = this._ctx;
      ctx.beginPath();

      if (this._options.transpose) {
        ctx.moveTo(cx - a + b, cy);
        ctx.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
        ctx.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
        ctx.lineTo(cx + a - b, cy);
        ctx.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
        ctx.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
        ctx.lineTo(cx - a + b, cy);
      } else {
        ctx.moveTo(cx, cy - a + b);
        ctx.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
        ctx.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
        ctx.lineTo(cx, cy + a - b);
        ctx.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
        ctx.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
        ctx.lineTo(cx, cy - a + b);
      }

      ctx.fill();
    };

    _proto4._updateSize = function _updateSize() {
      var opts = this._options;
      var charWidth = Math.ceil(this._ctx.measureText("W").width);
      this._hexSize = Math.floor(opts.spacing * (opts.fontSize + charWidth / Math.sqrt(3)) / 2);
      this._spacingX = this._hexSize * Math.sqrt(3) / 2;
      this._spacingY = this._hexSize * 1.5;
      var xprop;
      var yprop;

      if (opts.transpose) {
        xprop = "height";
        yprop = "width";
      } else {
        xprop = "width";
        yprop = "height";
      }

      this._ctx.canvas[xprop] = Math.ceil((opts.width + 1) * this._spacingX);
      this._ctx.canvas[yprop] = Math.ceil((opts.height - 1) * this._spacingY + 2 * this._hexSize);
    };

    return Hex;
  }(Canvas);
  /**
   * @class Rectangular backend
   * @private
   */


  var Rect =
  /** @class */
  function () {
    var Rect =
    /*#__PURE__*/
    function (_Canvas2) {
      _inheritsLoose(Rect, _Canvas2);

      function Rect() {
        var _this3;

        _this3 = _Canvas2.call(this) || this;
        _this3._spacingX = 0;
        _this3._spacingY = 0;
        _this3._canvasCache = {};
        return _this3;
      }

      var _proto5 = Rect.prototype;

      _proto5.setOptions = function setOptions(options) {
        _Canvas2.prototype.setOptions.call(this, options);

        this._canvasCache = {};
      };

      _proto5.draw = function draw(data, clearBefore) {
        if (Rect.cache) {
          this._drawWithCache(data);
        } else {
          this._drawNoCache(data, clearBefore);
        }
      };

      _proto5._drawWithCache = function _drawWithCache(data) {
        var x = data[0],
            y = data[1],
            ch = data[2],
            fg = data[3],
            bg = data[4];
        var hash = "" + ch + fg + bg;
        var canvas;

        if (hash in this._canvasCache) {
          canvas = this._canvasCache[hash];
        } else {
          var b = this._options.border;
          canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          canvas.width = this._spacingX;
          canvas.height = this._spacingY;
          ctx.fillStyle = bg;
          ctx.fillRect(b, b, canvas.width - b, canvas.height - b);

          if (ch) {
            ctx.fillStyle = fg;
            ctx.font = this._ctx.font;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var chars = [].concat(ch);

            for (var i = 0; i < chars.length; i++) {
              ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
            }
          }

          this._canvasCache[hash] = canvas;
        }

        this._ctx.drawImage(canvas, x * this._spacingX, y * this._spacingY);
      };

      _proto5._drawNoCache = function _drawNoCache(data, clearBefore) {
        var x = data[0],
            y = data[1],
            ch = data[2],
            fg = data[3],
            bg = data[4];

        if (clearBefore) {
          var b = this._options.border;
          this._ctx.fillStyle = bg;

          this._ctx.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
        }

        if (!ch) {
          return;
        }

        this._ctx.fillStyle = fg;
        var chars = [].concat(ch);

        for (var i = 0; i < chars.length; i++) {
          this._ctx.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
        }
      };

      _proto5.computeSize = function computeSize(availWidth, availHeight) {
        var width = Math.floor(availWidth / this._spacingX);
        var height = Math.floor(availHeight / this._spacingY);
        return [width, height];
      };

      _proto5.computeFontSize = function computeFontSize(availWidth, availHeight) {
        var boxWidth = Math.floor(availWidth / this._options.width);
        var boxHeight = Math.floor(availHeight / this._options.height);
        /* compute char ratio */

        var oldFont = this._ctx.font;
        this._ctx.font = "100px " + this._options.fontFamily;
        var width = Math.ceil(this._ctx.measureText("W").width);
        this._ctx.font = oldFont;
        var ratio = width / 100;
        var widthFraction = ratio * boxHeight / boxWidth;

        if (widthFraction > 1) {
          /* too wide with current aspect ratio */
          boxHeight = Math.floor(boxHeight / widthFraction);
        }

        return Math.floor(boxHeight / this._options.spacing);
      };

      _proto5._normalizedEventToPosition = function _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
      };

      _proto5._updateSize = function _updateSize() {
        var opts = this._options;
        var charWidth = Math.ceil(this._ctx.measureText("W").width);
        this._spacingX = Math.ceil(opts.spacing * charWidth);
        this._spacingY = Math.ceil(opts.spacing * opts.fontSize);

        if (opts.forceSquareRatio) {
          this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
        }

        this._ctx.canvas.width = opts.width * this._spacingX;
        this._ctx.canvas.height = opts.height * this._spacingY;
      };

      return Rect;
    }(Canvas);

    Rect.cache = false;
    return Rect;
  }();
  /**
   * @class Tile backend
   * @private
   */


  var Tile =
  /*#__PURE__*/
  function (_Canvas3) {
    _inheritsLoose(Tile, _Canvas3);

    function Tile() {
      var _this4;

      _this4 = _Canvas3.call(this) || this;
      _this4._colorCanvas = document.createElement("canvas");
      return _this4;
    }

    var _proto6 = Tile.prototype;

    _proto6.draw = function draw(data, clearBefore) {
      var x = data[0],
          y = data[1],
          ch = data[2],
          fg = data[3],
          bg = data[4];
      var tileWidth = this._options.tileWidth;
      var tileHeight = this._options.tileHeight;

      if (clearBefore) {
        if (this._options.tileColorize) {
          this._ctx.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        } else {
          this._ctx.fillStyle = bg;

          this._ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        }
      }

      if (!ch) {
        return;
      }

      var chars = [].concat(ch);
      var fgs = [].concat(fg);
      var bgs = [].concat(bg);

      for (var i = 0; i < chars.length; i++) {
        var tile = this._options.tileMap[chars[i]];

        if (!tile) {
          throw new Error("Char \"" + chars[i] + "\" not found in tileMap");
        }

        if (this._options.tileColorize) {
          // apply colorization
          var canvas = this._colorCanvas;
          var context = canvas.getContext("2d");
          context.globalCompositeOperation = "source-over";
          context.clearRect(0, 0, tileWidth, tileHeight);
          var _fg = fgs[i];
          var _bg = bgs[i];
          context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

          if (_fg != "transparent") {
            context.fillStyle = _fg;
            context.globalCompositeOperation = "source-atop";
            context.fillRect(0, 0, tileWidth, tileHeight);
          }

          if (_bg != "transparent") {
            context.fillStyle = _bg;
            context.globalCompositeOperation = "destination-over";
            context.fillRect(0, 0, tileWidth, tileHeight);
          }

          this._ctx.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        } else {
          // no colorizing, easy
          this._ctx.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        }
      }
    };

    _proto6.computeSize = function computeSize(availWidth, availHeight) {
      var width = Math.floor(availWidth / this._options.tileWidth);
      var height = Math.floor(availHeight / this._options.tileHeight);
      return [width, height];
    };

    _proto6.computeFontSize = function computeFontSize() {
      throw new Error("Tile backend does not understand font size");
    };

    _proto6._normalizedEventToPosition = function _normalizedEventToPosition(x, y) {
      return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    };

    _proto6._updateSize = function _updateSize() {
      var opts = this._options;
      this._ctx.canvas.width = opts.width * opts.tileWidth;
      this._ctx.canvas.height = opts.height * opts.tileHeight;
      this._colorCanvas.width = opts.tileWidth;
      this._colorCanvas.height = opts.tileHeight;
    };

    return Tile;
  }(Canvas);

  function fromString(str) {
    var cached, r;

    if (str in CACHE) {
      cached = CACHE[str];
    } else {
      if (str.charAt(0) == "#") {
        // hex rgb
        var matched = str.match(/[0-9a-f]/gi) || [];
        var values = matched.map(function (x) {
          return parseInt(x, 16);
        });

        if (values.length == 3) {
          cached = values.map(function (x) {
            return x * 17;
          });
        } else {
          for (var i = 0; i < 3; i++) {
            values[i + 1] += 16 * values[i];
            values.splice(i, 1);
          }

          cached = values;
        }
      } else if (r = str.match(/rgb\(([0-9, ]+)\)/i)) {
        // decimal rgb
        cached = r[1].split(/\s*,\s*/).map(function (x) {
          return parseInt(x);
        });
      } else {
        // html name
        cached = [0, 0, 0];
      }

      CACHE[str] = cached;
    }

    return cached.slice();
  }
  /**
   * Add two or more colors
   */


  function add(color1) {
    var result = color1.slice();

    for (var _len2 = arguments.length, colors = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      colors[_key2 - 1] = arguments[_key2];
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < colors.length; j++) {
        result[i] += colors[j][i];
      }
    }

    return result;
  }
  /**
   * Add two or more colors, MODIFIES FIRST ARGUMENT
   */


  function add_(color1) {
    for (var _len3 = arguments.length, colors = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      colors[_key3 - 1] = arguments[_key3];
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < colors.length; j++) {
        color1[i] += colors[j][i];
      }
    }

    return color1;
  }
  /**
   * Multiply (mix) two or more colors
   */


  function multiply(color1) {
    var result = color1.slice();

    for (var _len4 = arguments.length, colors = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      colors[_key4 - 1] = arguments[_key4];
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < colors.length; j++) {
        result[i] *= colors[j][i] / 255;
      }

      result[i] = Math.round(result[i]);
    }

    return result;
  }
  /**
   * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
   */


  function multiply_(color1) {
    for (var _len5 = arguments.length, colors = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      colors[_key5 - 1] = arguments[_key5];
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < colors.length; j++) {
        color1[i] *= colors[j][i] / 255;
      }

      color1[i] = Math.round(color1[i]);
    }

    return color1;
  }
  /**
   * Interpolate (blend) two colors with a given factor
   */


  function interpolate(color1, color2, factor) {
    if (factor === void 0) {
      factor = 0.5;
    }

    var result = color1.slice();

    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }

    return result;
  }

  var lerp = interpolate;
  /**
   * Interpolate (blend) two colors with a given factor in HSL mode
   */

  function interpolateHSL(color1, color2, factor) {
    if (factor === void 0) {
      factor = 0.5;
    }

    var hsl1 = rgb2hsl(color1);
    var hsl2 = rgb2hsl(color2);

    for (var i = 0; i < 3; i++) {
      hsl1[i] += factor * (hsl2[i] - hsl1[i]);
    }

    return hsl2rgb(hsl1);
  }

  var lerpHSL = interpolateHSL;
  /**
   * Create a new random color based on this one
   * @param color
   * @param diff Set of standard deviations
   */

  function randomize(color, diff) {
    if (!(diff instanceof Array)) {
      diff = Math.round(RNG$1.getNormal(0, diff));
    }

    var result = color.slice();

    for (var i = 0; i < 3; i++) {
      result[i] += diff instanceof Array ? Math.round(RNG$1.getNormal(0, diff[i])) : diff;
    }

    return result;
  }
  /**
   * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
   */


  function rgb2hsl(color) {
    var r = color[0] / 255;
    var g = color[1] / 255;
    var b = color[2] / 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h = 0,
        s,
        l = (max + min) / 2;

    if (max == min) {
      s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [h, s, l];
  }

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  /**
   * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
   */


  function hsl2rgb(color) {
    var l = color[2];

    if (color[1] == 0) {
      l = Math.round(l * 255);
      return [l, l, l];
    } else {
      var s = color[1];
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      var r = hue2rgb(p, q, color[0] + 1 / 3);
      var g = hue2rgb(p, q, color[0]);
      var b = hue2rgb(p, q, color[0] - 1 / 3);
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
  }

  function toRGB(color) {
    var clamped = color.map(function (x) {
      return clamp(x, 0, 255);
    });
    return "rgb(" + clamped.join(",") + ")";
  }

  function toHex(color) {
    var clamped = color.map(function (x) {
      return clamp(x, 0, 255).toString(16).padStart(2, "0");
    });
    return "#" + clamped.join("");
  }

  var CACHE = {
    "black": [0, 0, 0],
    "navy": [0, 0, 128],
    "darkblue": [0, 0, 139],
    "mediumblue": [0, 0, 205],
    "blue": [0, 0, 255],
    "darkgreen": [0, 100, 0],
    "green": [0, 128, 0],
    "teal": [0, 128, 128],
    "darkcyan": [0, 139, 139],
    "deepskyblue": [0, 191, 255],
    "darkturquoise": [0, 206, 209],
    "mediumspringgreen": [0, 250, 154],
    "lime": [0, 255, 0],
    "springgreen": [0, 255, 127],
    "aqua": [0, 255, 255],
    "cyan": [0, 255, 255],
    "midnightblue": [25, 25, 112],
    "dodgerblue": [30, 144, 255],
    "forestgreen": [34, 139, 34],
    "seagreen": [46, 139, 87],
    "darkslategray": [47, 79, 79],
    "darkslategrey": [47, 79, 79],
    "limegreen": [50, 205, 50],
    "mediumseagreen": [60, 179, 113],
    "turquoise": [64, 224, 208],
    "royalblue": [65, 105, 225],
    "steelblue": [70, 130, 180],
    "darkslateblue": [72, 61, 139],
    "mediumturquoise": [72, 209, 204],
    "indigo": [75, 0, 130],
    "darkolivegreen": [85, 107, 47],
    "cadetblue": [95, 158, 160],
    "cornflowerblue": [100, 149, 237],
    "mediumaquamarine": [102, 205, 170],
    "dimgray": [105, 105, 105],
    "dimgrey": [105, 105, 105],
    "slateblue": [106, 90, 205],
    "olivedrab": [107, 142, 35],
    "slategray": [112, 128, 144],
    "slategrey": [112, 128, 144],
    "lightslategray": [119, 136, 153],
    "lightslategrey": [119, 136, 153],
    "mediumslateblue": [123, 104, 238],
    "lawngreen": [124, 252, 0],
    "chartreuse": [127, 255, 0],
    "aquamarine": [127, 255, 212],
    "maroon": [128, 0, 0],
    "purple": [128, 0, 128],
    "olive": [128, 128, 0],
    "gray": [128, 128, 128],
    "grey": [128, 128, 128],
    "skyblue": [135, 206, 235],
    "lightskyblue": [135, 206, 250],
    "blueviolet": [138, 43, 226],
    "darkred": [139, 0, 0],
    "darkmagenta": [139, 0, 139],
    "saddlebrown": [139, 69, 19],
    "darkseagreen": [143, 188, 143],
    "lightgreen": [144, 238, 144],
    "mediumpurple": [147, 112, 216],
    "darkviolet": [148, 0, 211],
    "palegreen": [152, 251, 152],
    "darkorchid": [153, 50, 204],
    "yellowgreen": [154, 205, 50],
    "sienna": [160, 82, 45],
    "brown": [165, 42, 42],
    "darkgray": [169, 169, 169],
    "darkgrey": [169, 169, 169],
    "lightblue": [173, 216, 230],
    "greenyellow": [173, 255, 47],
    "paleturquoise": [175, 238, 238],
    "lightsteelblue": [176, 196, 222],
    "powderblue": [176, 224, 230],
    "firebrick": [178, 34, 34],
    "darkgoldenrod": [184, 134, 11],
    "mediumorchid": [186, 85, 211],
    "rosybrown": [188, 143, 143],
    "darkkhaki": [189, 183, 107],
    "silver": [192, 192, 192],
    "mediumvioletred": [199, 21, 133],
    "indianred": [205, 92, 92],
    "peru": [205, 133, 63],
    "chocolate": [210, 105, 30],
    "tan": [210, 180, 140],
    "lightgray": [211, 211, 211],
    "lightgrey": [211, 211, 211],
    "palevioletred": [216, 112, 147],
    "thistle": [216, 191, 216],
    "orchid": [218, 112, 214],
    "goldenrod": [218, 165, 32],
    "crimson": [220, 20, 60],
    "gainsboro": [220, 220, 220],
    "plum": [221, 160, 221],
    "burlywood": [222, 184, 135],
    "lightcyan": [224, 255, 255],
    "lavender": [230, 230, 250],
    "darksalmon": [233, 150, 122],
    "violet": [238, 130, 238],
    "palegoldenrod": [238, 232, 170],
    "lightcoral": [240, 128, 128],
    "khaki": [240, 230, 140],
    "aliceblue": [240, 248, 255],
    "honeydew": [240, 255, 240],
    "azure": [240, 255, 255],
    "sandybrown": [244, 164, 96],
    "wheat": [245, 222, 179],
    "beige": [245, 245, 220],
    "whitesmoke": [245, 245, 245],
    "mintcream": [245, 255, 250],
    "ghostwhite": [248, 248, 255],
    "salmon": [250, 128, 114],
    "antiquewhite": [250, 235, 215],
    "linen": [250, 240, 230],
    "lightgoldenrodyellow": [250, 250, 210],
    "oldlace": [253, 245, 230],
    "red": [255, 0, 0],
    "fuchsia": [255, 0, 255],
    "magenta": [255, 0, 255],
    "deeppink": [255, 20, 147],
    "orangered": [255, 69, 0],
    "tomato": [255, 99, 71],
    "hotpink": [255, 105, 180],
    "coral": [255, 127, 80],
    "darkorange": [255, 140, 0],
    "lightsalmon": [255, 160, 122],
    "orange": [255, 165, 0],
    "lightpink": [255, 182, 193],
    "pink": [255, 192, 203],
    "gold": [255, 215, 0],
    "peachpuff": [255, 218, 185],
    "navajowhite": [255, 222, 173],
    "moccasin": [255, 228, 181],
    "bisque": [255, 228, 196],
    "mistyrose": [255, 228, 225],
    "blanchedalmond": [255, 235, 205],
    "papayawhip": [255, 239, 213],
    "lavenderblush": [255, 240, 245],
    "seashell": [255, 245, 238],
    "cornsilk": [255, 248, 220],
    "lemonchiffon": [255, 250, 205],
    "floralwhite": [255, 250, 240],
    "snow": [255, 250, 250],
    "yellow": [255, 255, 0],
    "lightyellow": [255, 255, 224],
    "ivory": [255, 255, 240],
    "white": [255, 255, 255]
  };
  var color =
  /*#__PURE__*/
  Object.freeze({
    fromString: fromString,
    add: add,
    add_: add_,
    multiply: multiply,
    multiply_: multiply_,
    interpolate: interpolate,
    lerp: lerp,
    interpolateHSL: interpolateHSL,
    lerpHSL: lerpHSL,
    randomize: randomize,
    rgb2hsl: rgb2hsl,
    hsl2rgb: hsl2rgb,
    toRGB: toRGB,
    toHex: toHex
  });
  /**
   * @class Tile backend
   * @private
   */

  var TileGL =
  /*#__PURE__*/
  function (_Backend2) {
    _inheritsLoose(TileGL, _Backend2);

    function TileGL() {
      var _this5;

      _this5 = _Backend2.call(this) || this;
      _this5._uniforms = {};

      try {
        _this5._gl = _this5._initWebGL();
      } catch (e) {
        alert(e.message);
      }

      return _this5;
    }

    TileGL.isSupported = function isSupported() {
      return !!document.createElement("canvas").getContext("webgl2", {
        preserveDrawingBuffer: true
      });
    };

    var _proto7 = TileGL.prototype;

    _proto7.schedule = function schedule(cb) {
      requestAnimationFrame(cb);
    };

    _proto7.getContainer = function getContainer() {
      return this._gl.canvas;
    };

    _proto7.setOptions = function setOptions(opts) {
      var _this6 = this;

      _Backend2.prototype.setOptions.call(this, opts);

      this._updateSize();

      var tileSet = this._options.tileSet;

      if (tileSet && "complete" in tileSet && !tileSet.complete) {
        tileSet.addEventListener("load", function () {
          return _this6._updateTexture(tileSet);
        });
      } else {
        this._updateTexture(tileSet);
      }
    };

    _proto7.draw = function draw(data, clearBefore) {
      var gl = this._gl;
      var opts = this._options;
      var x = data[0],
          y = data[1],
          ch = data[2],
          fg = data[3],
          bg = data[4];
      var scissorY = gl.canvas.height - (y + 1) * opts.tileHeight;
      gl.scissor(x * opts.tileWidth, scissorY, opts.tileWidth, opts.tileHeight);

      if (clearBefore) {
        if (opts.tileColorize) {
          gl.clearColor(0, 0, 0, 0);
        } else {
          gl.clearColor.apply(gl, parseColor(bg));
        }

        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      if (!ch) {
        return;
      }

      var chars = [].concat(ch);
      var bgs = [].concat(bg);
      var fgs = [].concat(fg);
      gl.uniform2fv(this._uniforms["targetPosRel"], [x, y]);

      for (var i = 0; i < chars.length; i++) {
        var tile = this._options.tileMap[chars[i]];

        if (!tile) {
          throw new Error("Char \"" + chars[i] + "\" not found in tileMap");
        }

        gl.uniform1f(this._uniforms["colorize"], opts.tileColorize ? 1 : 0);
        gl.uniform2fv(this._uniforms["tilesetPosAbs"], tile);

        if (opts.tileColorize) {
          gl.uniform4fv(this._uniforms["tint"], parseColor(fgs[i]));
          gl.uniform4fv(this._uniforms["bg"], parseColor(bgs[i]));
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      /*
      
      
              for (let i=0;i<chars.length;i++) {
      
                  if (this._options.tileColorize) { // apply colorization
                      let canvas = this._colorCanvas;
                      let context = canvas.getContext("2d") as CanvasRenderingContext2D;
                      context.globalCompositeOperation = "source-over";
                      context.clearRect(0, 0, tileWidth, tileHeight);
      
                      let fg = fgs[i];
                      let bg = bgs[i];
      
                      context.drawImage(
                          this._options.tileSet!,
                          tile[0], tile[1], tileWidth, tileHeight,
                          0, 0, tileWidth, tileHeight
                      );
      
                      if (fg != "transparent") {
                          context.fillStyle = fg;
                          context.globalCompositeOperation = "source-atop";
                          context.fillRect(0, 0, tileWidth, tileHeight);
                      }
      
                      if (bg != "transparent") {
                          context.fillStyle = bg;
                          context.globalCompositeOperation = "destination-over";
                          context.fillRect(0, 0, tileWidth, tileHeight);
                      }
      
                      this._ctx.drawImage(canvas, x*tileWidth, y*tileHeight, tileWidth, tileHeight);
                  } else { // no colorizing, easy
                      this._ctx.drawImage(
                          this._options.tileSet!,
                          tile[0], tile[1], tileWidth, tileHeight,
                          x*tileWidth, y*tileHeight, tileWidth, tileHeight
                      );
                  }
              }
      
      */

    };

    _proto7.clear = function clear() {
      var gl = this._gl;
      gl.clearColor.apply(gl, parseColor(this._options.bg));
      gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    _proto7.computeSize = function computeSize(availWidth, availHeight) {
      var width = Math.floor(availWidth / this._options.tileWidth);
      var height = Math.floor(availHeight / this._options.tileHeight);
      return [width, height];
    };

    _proto7.computeFontSize = function computeFontSize() {
      throw new Error("Tile backend does not understand font size");
    };

    _proto7.eventToPosition = function eventToPosition(x, y) {
      var canvas = this._gl.canvas;
      var rect = canvas.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
      x *= canvas.width / rect.width;
      y *= canvas.height / rect.height;

      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
        return [-1, -1];
      }

      return this._normalizedEventToPosition(x, y);
    };

    _proto7._initWebGL = function _initWebGL() {
      var _this7 = this;

      var gl = document.createElement("canvas").getContext("webgl2", {
        preserveDrawingBuffer: true
      });
      window.gl = gl;
      var program = createProgram(gl, VS, FS);
      gl.useProgram(program);
      createQuad(gl);
      UNIFORMS.forEach(function (name) {
        return _this7._uniforms[name] = gl.getUniformLocation(program, name);
      });
      this._program = program;
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.SCISSOR_TEST);
      return gl;
    };

    _proto7._normalizedEventToPosition = function _normalizedEventToPosition(x, y) {
      return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    };

    _proto7._updateSize = function _updateSize() {
      var gl = this._gl;
      var opts = this._options;
      var canvasSize = [opts.width * opts.tileWidth, opts.height * opts.tileHeight];
      gl.canvas.width = canvasSize[0];
      gl.canvas.height = canvasSize[1];
      gl.viewport(0, 0, canvasSize[0], canvasSize[1]);
      gl.uniform2fv(this._uniforms["tileSize"], [opts.tileWidth, opts.tileHeight]);
      gl.uniform2fv(this._uniforms["targetSize"], canvasSize);
    };

    _proto7._updateTexture = function _updateTexture(tileSet) {
      createTexture(this._gl, tileSet);
    };

    return TileGL;
  }(Backend);

  var UNIFORMS = ["targetPosRel", "tilesetPosAbs", "tileSize", "targetSize", "colorize", "bg", "tint"];
  var VS = "\n#version 300 es\n\nin vec2 tilePosRel;\nout vec2 tilesetPosPx;\n\nuniform vec2 tilesetPosAbs;\nuniform vec2 tileSize;\nuniform vec2 targetSize;\nuniform vec2 targetPosRel;\n\nvoid main() {\n\tvec2 targetPosPx = (targetPosRel + tilePosRel) * tileSize;\n\tvec2 targetPosNdc = ((targetPosPx / targetSize)-0.5)*2.0;\n\ttargetPosNdc.y *= -1.0;\n\n\tgl_Position = vec4(targetPosNdc, 0.0, 1.0);\n\ttilesetPosPx = tilesetPosAbs + tilePosRel * tileSize;\n}".trim();
  var FS = "\n#version 300 es\nprecision highp float;\n\nin vec2 tilesetPosPx;\nout vec4 fragColor;\nuniform sampler2D image;\nuniform bool colorize;\nuniform vec4 bg;\nuniform vec4 tint;\n\nvoid main() {\n\tfragColor = vec4(0, 0, 0, 1);\n\n\tvec4 texel = texelFetch(image, ivec2(tilesetPosPx), 0);\n\n\tif (colorize) {\n\t\ttexel.rgb = tint.a * tint.rgb + (1.0-tint.a) * texel.rgb;\n\t\tfragColor.rgb = texel.a*texel.rgb + (1.0-texel.a)*bg.rgb;\n\t\tfragColor.a = texel.a + (1.0-texel.a)*bg.a;\n\t} else {\n\t\tfragColor = texel;\n\t}\n}".trim();

  function createProgram(gl, vss, fss) {
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vss);
    gl.compileShader(vs);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(vs) || "");
    }

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fss);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(fs) || "");
    }

    var p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);

    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(p) || "");
    }

    return p;
  }

  function createQuad(gl) {
    var pos = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  function createTexture(gl, data) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return t;
  }

  var colorCache = {};

  function parseColor(color) {
    if (!(color in colorCache)) {
      var parsed;

      if (color == "transparent") {
        parsed = [0, 0, 0, 0];
      } else if (color.indexOf("rgba") > -1) {
        parsed = (color.match(/[\d.]+/g) || []).map(Number);

        for (var i = 0; i < 3; i++) {
          parsed[i] = parsed[i] / 255;
        }
      } else {
        parsed = fromString(color).map(function ($) {
          return $ / 255;
        });
        parsed.push(1);
      }

      colorCache[color] = parsed;
    }

    return colorCache[color];
  }

  function clearToAnsi(bg) {
    return "\x1B[0;48;5;" + termcolor(bg) + "m\x1B[2J";
  }

  function colorToAnsi(fg, bg) {
    return "\x1B[0;38;5;" + termcolor(fg) + ";48;5;" + termcolor(bg) + "m";
  }

  function positionToAnsi(x, y) {
    return "\x1B[" + (y + 1) + ";" + (x + 1) + "H";
  }

  function termcolor(color) {
    var SRC_COLORS = 256.0;
    var DST_COLORS = 6.0;
    var COLOR_RATIO = DST_COLORS / SRC_COLORS;
    var rgb = fromString(color);
    var r = Math.floor(rgb[0] * COLOR_RATIO);
    var g = Math.floor(rgb[1] * COLOR_RATIO);
    var b = Math.floor(rgb[2] * COLOR_RATIO);
    return r * 36 + g * 6 + b * 1 + 16;
  }

  var Term =
  /*#__PURE__*/
  function (_Backend3) {
    _inheritsLoose(Term, _Backend3);

    function Term() {
      var _this8;

      _this8 = _Backend3.call(this) || this;
      _this8._offset = [0, 0];
      _this8._cursor = [-1, -1];
      _this8._lastColor = "";
      return _this8;
    }

    var _proto8 = Term.prototype;

    _proto8.schedule = function schedule(cb) {
      setTimeout(cb, 1000 / 60);
    };

    _proto8.setOptions = function setOptions(options) {
      _Backend3.prototype.setOptions.call(this, options);

      var size = [options.width, options.height];
      var avail = this.computeSize();
      this._offset = avail.map(function (val, index) {
        return Math.floor((val - size[index]) / 2);
      });
    };

    _proto8.clear = function clear() {
      process.stdout.write(clearToAnsi(this._options.bg));
    };

    _proto8.draw = function draw(data, clearBefore) {
      // determine where to draw what with what colors
      var x = data[0],
          y = data[1],
          ch = data[2],
          fg = data[3],
          bg = data[4]; // determine if we need to move the terminal cursor

      var dx = this._offset[0] + x;
      var dy = this._offset[1] + y;
      var size = this.computeSize();

      if (dx < 0 || dx >= size[0]) {
        return;
      }

      if (dy < 0 || dy >= size[1]) {
        return;
      }

      if (dx !== this._cursor[0] || dy !== this._cursor[1]) {
        process.stdout.write(positionToAnsi(dx, dy));
        this._cursor[0] = dx;
        this._cursor[1] = dy;
      } // terminals automatically clear, but if we're clearing when we're
      // not otherwise provided with a character, just use a space instead


      if (clearBefore) {
        if (!ch) {
          ch = " ";
        }
      } // if we're not clearing and not provided with a character, do nothing


      if (!ch) {
        return;
      } // determine if we need to change colors


      var newColor = colorToAnsi(fg, bg);

      if (newColor !== this._lastColor) {
        process.stdout.write(newColor);
        this._lastColor = newColor;
      }

      if (ch != '\t') {
        // write the provided symbol to the display
        var chars = [].concat(ch);
        process.stdout.write(chars[0]);
      } // update our position, given that we wrote a character


      this._cursor[0]++;

      if (this._cursor[0] >= size[0]) {
        this._cursor[0] = 0;
        this._cursor[1]++;
      }
    };

    _proto8.computeFontSize = function computeFontSize() {
      throw new Error("Terminal backend has no notion of font size");
    };

    _proto8.eventToPosition = function eventToPosition(x, y) {
      return [x, y];
    };

    _proto8.computeSize = function computeSize() {
      return [process.stdout.columns, process.stdout.rows];
    };

    return Term;
  }(Backend);
  /**
   * @namespace
   * Contains text tokenization and breaking routines
   */


  var RE_COLORS = /%([bc]){([^}]*)}/g; // token types

  var TYPE_TEXT = 0;
  var TYPE_NEWLINE = 1;
  var TYPE_FG = 2;
  var TYPE_BG = 3;
  /**
   * Measure size of a resulting text block
   */

  function measure(str, maxWidth) {
    var result = {
      width: 0,
      height: 1
    };
    var tokens = tokenize(str, maxWidth);
    var lineWidth = 0;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      switch (token.type) {
        case TYPE_TEXT:
          lineWidth += token.value.length;
          break;

        case TYPE_NEWLINE:
          result.height++;
          result.width = Math.max(result.width, lineWidth);
          lineWidth = 0;
          break;
      }
    }

    result.width = Math.max(result.width, lineWidth);
    return result;
  }
  /**
   * Convert string to a series of a formatting commands
   */


  function tokenize(str, maxWidth) {
    var result = [];
    /* first tokenization pass - split texts and color formatting commands */

    var offset = 0;
    str.replace(RE_COLORS, function (match, type, name, index) {
      /* string before */
      var part = str.substring(offset, index);

      if (part.length) {
        result.push({
          type: TYPE_TEXT,
          value: part
        });
      }
      /* color command */


      result.push({
        type: type == "c" ? TYPE_FG : TYPE_BG,
        value: name.trim()
      });
      offset = index + match.length;
      return "";
    });
    /* last remaining part */

    var part = str.substring(offset);

    if (part.length) {
      result.push({
        type: TYPE_TEXT,
        value: part
      });
    }

    return breakLines(result, maxWidth);
  }
  /* insert line breaks into first-pass tokenized data */


  function breakLines(tokens, maxWidth) {
    if (!maxWidth) {
      maxWidth = Infinity;
    }

    var i = 0;
    var lineLength = 0;
    var lastTokenWithSpace = -1;

    while (i < tokens.length) {
      /* take all text tokens, remove space, apply linebreaks */
      var token = tokens[i];

      if (token.type == TYPE_NEWLINE) {
        /* reset */
        lineLength = 0;
        lastTokenWithSpace = -1;
      }

      if (token.type != TYPE_TEXT) {
        /* skip non-text tokens */
        i++;
        continue;
      }
      /* remove spaces at the beginning of line */


      while (lineLength == 0 && token.value.charAt(0) == " ") {
        token.value = token.value.substring(1);
      }
      /* forced newline? insert two new tokens after this one */


      var _index2 = token.value.indexOf("\n");

      if (_index2 != -1) {
        token.value = breakInsideToken(tokens, i, _index2, true);
        /* if there are spaces at the end, we must remove them (we do not want the line too long) */

        var arr = token.value.split("");

        while (arr.length && arr[arr.length - 1] == " ") {
          arr.pop();
        }

        token.value = arr.join("");
      }
      /* token degenerated? */


      if (!token.value.length) {
        tokens.splice(i, 1);
        continue;
      }

      if (lineLength + token.value.length > maxWidth) {
        /* line too long, find a suitable breaking spot */

        /* is it possible to break within this token? */
        var _index3 = -1;

        while (1) {
          var nextIndex = token.value.indexOf(" ", _index3 + 1);

          if (nextIndex == -1) {
            break;
          }

          if (lineLength + nextIndex > maxWidth) {
            break;
          }

          _index3 = nextIndex;
        }

        if (_index3 != -1) {
          /* break at space within this one */
          token.value = breakInsideToken(tokens, i, _index3, true);
        } else if (lastTokenWithSpace != -1) {
          /* is there a previous token where a break can occur? */
          var _token = tokens[lastTokenWithSpace];

          var breakIndex = _token.value.lastIndexOf(" ");

          _token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
          i = lastTokenWithSpace;
        } else {
          /* force break in this token */
          token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
        }
      } else {
        /* line not long, continue */
        lineLength += token.value.length;

        if (token.value.indexOf(" ") != -1) {
          lastTokenWithSpace = i;
        }
      }

      i++;
      /* advance to next token */
    }

    tokens.push({
      type: TYPE_NEWLINE
    });
    /* insert fake newline to fix the last text line */

    /* remove trailing space from text tokens before newlines */

    var lastTextToken = null;

    for (var _i = 0; _i < tokens.length; _i++) {
      var _token2 = tokens[_i];

      switch (_token2.type) {
        case TYPE_TEXT:
          lastTextToken = _token2;
          break;

        case TYPE_NEWLINE:
          if (lastTextToken) {
            /* remove trailing space */
            var _arr = lastTextToken.value.split("");

            while (_arr.length && _arr[_arr.length - 1] == " ") {
              _arr.pop();
            }

            lastTextToken.value = _arr.join("");
          }

          lastTextToken = null;
          break;
      }
    }

    tokens.pop();
    /* remove fake token */

    return tokens;
  }
  /**
   * Create new tokens and insert them into the stream
   * @param {object[]} tokens
   * @param {int} tokenIndex Token being processed
   * @param {int} breakIndex Index within current token's value
   * @param {bool} removeBreakChar Do we want to remove the breaking character?
   * @returns {string} remaining unbroken token value
   */


  function breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
    var newBreakToken = {
      type: TYPE_NEWLINE
    };
    var newTextToken = {
      type: TYPE_TEXT,
      value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
    };
    tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
    return tokens[tokenIndex].value.substring(0, breakIndex);
  }

  var text =
  /*#__PURE__*/
  Object.freeze({
    TYPE_TEXT: TYPE_TEXT,
    TYPE_NEWLINE: TYPE_NEWLINE,
    TYPE_FG: TYPE_FG,
    TYPE_BG: TYPE_BG,
    measure: measure,
    tokenize: tokenize
  });
  /** Default with for display and map generators */

  var DEFAULT_WIDTH = 80;
  /** Default height for display and map generators */

  var DEFAULT_HEIGHT = 25;
  var DIRS = {
    4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
    8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
    6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
  };
  var KEYS = {
    /** Cancel key. */
    VK_CANCEL: 3,

    /** Help key. */
    VK_HELP: 6,

    /** Backspace key. */
    VK_BACK_SPACE: 8,

    /** Tab key. */
    VK_TAB: 9,

    /** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
    VK_CLEAR: 12,

    /** Return/enter key on the main keyboard. */
    VK_RETURN: 13,

    /** Reserved, but not used. */
    VK_ENTER: 14,

    /** Shift key. */
    VK_SHIFT: 16,

    /** Control key. */
    VK_CONTROL: 17,

    /** Alt (Option on Mac) key. */
    VK_ALT: 18,

    /** Pause key. */
    VK_PAUSE: 19,

    /** Caps lock. */
    VK_CAPS_LOCK: 20,

    /** Escape key. */
    VK_ESCAPE: 27,

    /** Space bar. */
    VK_SPACE: 32,

    /** Page Up key. */
    VK_PAGE_UP: 33,

    /** Page Down key. */
    VK_PAGE_DOWN: 34,

    /** End key. */
    VK_END: 35,

    /** Home key. */
    VK_HOME: 36,

    /** Left arrow. */
    VK_LEFT: 37,

    /** Up arrow. */
    VK_UP: 38,

    /** Right arrow. */
    VK_RIGHT: 39,

    /** Down arrow. */
    VK_DOWN: 40,

    /** Print Screen key. */
    VK_PRINTSCREEN: 44,

    /** Ins(ert) key. */
    VK_INSERT: 45,

    /** Del(ete) key. */
    VK_DELETE: 46,

    /***/
    VK_0: 48,

    /***/
    VK_1: 49,

    /***/
    VK_2: 50,

    /***/
    VK_3: 51,

    /***/
    VK_4: 52,

    /***/
    VK_5: 53,

    /***/
    VK_6: 54,

    /***/
    VK_7: 55,

    /***/
    VK_8: 56,

    /***/
    VK_9: 57,

    /** Colon (:) key. Requires Gecko 15.0 */
    VK_COLON: 58,

    /** Semicolon (;) key. */
    VK_SEMICOLON: 59,

    /** Less-than (<) key. Requires Gecko 15.0 */
    VK_LESS_THAN: 60,

    /** Equals (=) key. */
    VK_EQUALS: 61,

    /** Greater-than (>) key. Requires Gecko 15.0 */
    VK_GREATER_THAN: 62,

    /** Question mark (?) key. Requires Gecko 15.0 */
    VK_QUESTION_MARK: 63,

    /** Atmark (@) key. Requires Gecko 15.0 */
    VK_AT: 64,

    /***/
    VK_A: 65,

    /***/
    VK_B: 66,

    /***/
    VK_C: 67,

    /***/
    VK_D: 68,

    /***/
    VK_E: 69,

    /***/
    VK_F: 70,

    /***/
    VK_G: 71,

    /***/
    VK_H: 72,

    /***/
    VK_I: 73,

    /***/
    VK_J: 74,

    /***/
    VK_K: 75,

    /***/
    VK_L: 76,

    /***/
    VK_M: 77,

    /***/
    VK_N: 78,

    /***/
    VK_O: 79,

    /***/
    VK_P: 80,

    /***/
    VK_Q: 81,

    /***/
    VK_R: 82,

    /***/
    VK_S: 83,

    /***/
    VK_T: 84,

    /***/
    VK_U: 85,

    /***/
    VK_V: 86,

    /***/
    VK_W: 87,

    /***/
    VK_X: 88,

    /***/
    VK_Y: 89,

    /***/
    VK_Z: 90,

    /***/
    VK_CONTEXT_MENU: 93,

    /** 0 on the numeric keypad. */
    VK_NUMPAD0: 96,

    /** 1 on the numeric keypad. */
    VK_NUMPAD1: 97,

    /** 2 on the numeric keypad. */
    VK_NUMPAD2: 98,

    /** 3 on the numeric keypad. */
    VK_NUMPAD3: 99,

    /** 4 on the numeric keypad. */
    VK_NUMPAD4: 100,

    /** 5 on the numeric keypad. */
    VK_NUMPAD5: 101,

    /** 6 on the numeric keypad. */
    VK_NUMPAD6: 102,

    /** 7 on the numeric keypad. */
    VK_NUMPAD7: 103,

    /** 8 on the numeric keypad. */
    VK_NUMPAD8: 104,

    /** 9 on the numeric keypad. */
    VK_NUMPAD9: 105,

    /** * on the numeric keypad. */
    VK_MULTIPLY: 106,

    /** + on the numeric keypad. */
    VK_ADD: 107,

    /***/
    VK_SEPARATOR: 108,

    /** - on the numeric keypad. */
    VK_SUBTRACT: 109,

    /** Decimal point on the numeric keypad. */
    VK_DECIMAL: 110,

    /** / on the numeric keypad. */
    VK_DIVIDE: 111,

    /** F1 key. */
    VK_F1: 112,

    /** F2 key. */
    VK_F2: 113,

    /** F3 key. */
    VK_F3: 114,

    /** F4 key. */
    VK_F4: 115,

    /** F5 key. */
    VK_F5: 116,

    /** F6 key. */
    VK_F6: 117,

    /** F7 key. */
    VK_F7: 118,

    /** F8 key. */
    VK_F8: 119,

    /** F9 key. */
    VK_F9: 120,

    /** F10 key. */
    VK_F10: 121,

    /** F11 key. */
    VK_F11: 122,

    /** F12 key. */
    VK_F12: 123,

    /** F13 key. */
    VK_F13: 124,

    /** F14 key. */
    VK_F14: 125,

    /** F15 key. */
    VK_F15: 126,

    /** F16 key. */
    VK_F16: 127,

    /** F17 key. */
    VK_F17: 128,

    /** F18 key. */
    VK_F18: 129,

    /** F19 key. */
    VK_F19: 130,

    /** F20 key. */
    VK_F20: 131,

    /** F21 key. */
    VK_F21: 132,

    /** F22 key. */
    VK_F22: 133,

    /** F23 key. */
    VK_F23: 134,

    /** F24 key. */
    VK_F24: 135,

    /** Num Lock key. */
    VK_NUM_LOCK: 144,

    /** Scroll Lock key. */
    VK_SCROLL_LOCK: 145,

    /** Circumflex (^) key. Requires Gecko 15.0 */
    VK_CIRCUMFLEX: 160,

    /** Exclamation (!) key. Requires Gecko 15.0 */
    VK_EXCLAMATION: 161,

    /** Double quote () key. Requires Gecko 15.0 */
    VK_DOUBLE_QUOTE: 162,

    /** Hash (#) key. Requires Gecko 15.0 */
    VK_HASH: 163,

    /** Dollar sign ($) key. Requires Gecko 15.0 */
    VK_DOLLAR: 164,

    /** Percent (%) key. Requires Gecko 15.0 */
    VK_PERCENT: 165,

    /** Ampersand (&) key. Requires Gecko 15.0 */
    VK_AMPERSAND: 166,

    /** Underscore (_) key. Requires Gecko 15.0 */
    VK_UNDERSCORE: 167,

    /** Open parenthesis (() key. Requires Gecko 15.0 */
    VK_OPEN_PAREN: 168,

    /** Close parenthesis ()) key. Requires Gecko 15.0 */
    VK_CLOSE_PAREN: 169,

    /* Asterisk (*) key. Requires Gecko 15.0 */
    VK_ASTERISK: 170,

    /** Plus (+) key. Requires Gecko 15.0 */
    VK_PLUS: 171,

    /** Pipe (|) key. Requires Gecko 15.0 */
    VK_PIPE: 172,

    /** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
    VK_HYPHEN_MINUS: 173,

    /** Open curly bracket ({) key. Requires Gecko 15.0 */
    VK_OPEN_CURLY_BRACKET: 174,

    /** Close curly bracket (}) key. Requires Gecko 15.0 */
    VK_CLOSE_CURLY_BRACKET: 175,

    /** Tilde (~) key. Requires Gecko 15.0 */
    VK_TILDE: 176,

    /** Comma (,) key. */
    VK_COMMA: 188,

    /** Period (.) key. */
    VK_PERIOD: 190,

    /** Slash (/) key. */
    VK_SLASH: 191,

    /** Back tick (`) key. */
    VK_BACK_QUOTE: 192,

    /** Open square bracket ([) key. */
    VK_OPEN_BRACKET: 219,

    /** Back slash (\) key. */
    VK_BACK_SLASH: 220,

    /** Close square bracket (]) key. */
    VK_CLOSE_BRACKET: 221,

    /** Quote (''') key. */
    VK_QUOTE: 222,

    /** Meta key on Linux, Command key on Mac. */
    VK_META: 224,

    /** AltGr key on Linux. Requires Gecko 15.0 */
    VK_ALTGR: 225,

    /** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
    VK_WIN: 91,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANA: 21,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANGUL: 21,

    /** Φï▒µò░ key on Japanese Mac keyboard. Requires Gecko 15.0 */
    VK_EISU: 22,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_JUNJA: 23,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_FINAL: 24,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANJA: 25,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANJI: 25,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_CONVERT: 28,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_NONCONVERT: 29,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_ACCEPT: 30,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_MODECHANGE: 31,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_SELECT: 41,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_PRINT: 42,

    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_EXECUTE: 43,

    /** Linux support for this keycode was added in Gecko 4.0.	 */
    VK_SLEEP: 95
  };
  var BACKENDS = {
    "hex": Hex,
    "rect": Rect,
    "tile": Tile,
    "tile-gl": TileGL,
    "term": Term
  };
  var DEFAULT_OPTIONS = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    transpose: false,
    layout: "rect",
    fontSize: 15,
    spacing: 1,
    border: 0,
    forceSquareRatio: false,
    fontFamily: "monospace",
    fontStyle: "",
    fg: "#ccc",
    bg: "#000",
    tileWidth: 32,
    tileHeight: 32,
    tileMap: {},
    tileSet: null,
    tileColorize: false
  };
  /**
   * @class Visual map display
   */

  var Display =
  /** @class */
  function () {
    var Display =
    /*#__PURE__*/
    function () {
      function Display(options) {
        if (options === void 0) {
          options = {};
        }

        this._data = {};
        this._dirty = false; // false = nothing, true = all, object = dirty cells

        this._options = {};
        options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.setOptions(options);
        this.DEBUG = this.DEBUG.bind(this);
        this._tick = this._tick.bind(this);

        this._backend.schedule(this._tick);
      }
      /**
       * Debug helper, ideal as a map generator callback. Always bound to this.
       * @param {int} x
       * @param {int} y
       * @param {int} what
       */


      var _proto9 = Display.prototype;

      _proto9.DEBUG = function DEBUG(x, y, what) {
        var colors = [this._options.bg, this._options.fg];
        this.draw(x, y, null, null, colors[what % colors.length]);
      };
      /**
       * Clear the whole display (cover it with background color)
       */


      _proto9.clear = function clear() {
        this._data = {};
        this._dirty = true;
      };
      /**
       * @see ROT.Display
       */


      _proto9.setOptions = function setOptions(options) {
        Object.assign(this._options, options);

        if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
          if (options.layout) {
            var ctor = BACKENDS[options.layout];
            this._backend = new ctor();
          }

          this._backend.setOptions(this._options);

          this._dirty = true;
        }

        return this;
      };
      /**
       * Returns currently set options
       */


      _proto9.getOptions = function getOptions() {
        return this._options;
      };
      /**
       * Returns the DOM node of this display
       */


      _proto9.getContainer = function getContainer() {
        return this._backend.getContainer();
      };
      /**
       * Compute the maximum width/height to fit into a set of given constraints
       * @param {int} availWidth Maximum allowed pixel width
       * @param {int} availHeight Maximum allowed pixel height
       * @returns {int[2]} cellWidth,cellHeight
       */


      _proto9.computeSize = function computeSize(availWidth, availHeight) {
        return this._backend.computeSize(availWidth, availHeight);
      };
      /**
       * Compute the maximum font size to fit into a set of given constraints
       * @param {int} availWidth Maximum allowed pixel width
       * @param {int} availHeight Maximum allowed pixel height
       * @returns {int} fontSize
       */


      _proto9.computeFontSize = function computeFontSize(availWidth, availHeight) {
        return this._backend.computeFontSize(availWidth, availHeight);
      };

      _proto9.computeTileSize = function computeTileSize(availWidth, availHeight) {
        var width = Math.floor(availWidth / this._options.width);
        var height = Math.floor(availHeight / this._options.height);
        return [width, height];
      };
      /**
       * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
       * @param {Event} e event
       * @returns {int[2]} -1 for values outside of the canvas
       */


      _proto9.eventToPosition = function eventToPosition(e) {
        var x, y;

        if ("touches" in e) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        } else {
          x = e.clientX;
          y = e.clientY;
        }

        return this._backend.eventToPosition(x, y);
      };
      /**
       * @param {int} x
       * @param {int} y
       * @param {string || string[]} ch One or more chars (will be overlapping themselves)
       * @param {string} [fg] foreground color
       * @param {string} [bg] background color
       */


      _proto9.draw = function draw(x, y, ch, fg, bg) {
        if (!fg) {
          fg = this._options.fg;
        }

        if (!bg) {
          bg = this._options.bg;
        }

        var key = x + "," + y;
        this._data[key] = [x, y, ch, fg, bg];

        if (this._dirty === true) {
          return;
        } // will already redraw everything 


        if (!this._dirty) {
          this._dirty = {};
        } // first!


        this._dirty[key] = true;
      };
      /**
       * @param {int} x
       * @param {int} y
       * @param {string || string[]} ch One or more chars (will be overlapping themselves)
       * @param {string || null} [fg] foreground color
       * @param {string || null} [bg] background color
       */


      _proto9.drawOver = function drawOver(x, y, ch, fg, bg) {
        var key = x + "," + y;
        var existing = this._data[key];

        if (existing) {
          existing[2] = ch || existing[2];
          existing[3] = fg || existing[3];
          existing[4] = bg || existing[4];
        } else {
          this.draw(x, y, ch, fg, bg);
        }
      };
      /**
       * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
       * @param {int} x
       * @param {int} y
       * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
       * @param {int} [maxWidth] wrap at what width?
       * @returns {int} lines drawn
       */


      _proto9.drawText = function drawText(x, y, text, maxWidth) {
        var fg = null;
        var bg = null;
        var cx = x;
        var cy = y;
        var lines = 1;

        if (!maxWidth) {
          maxWidth = this._options.width - x;
        }

        var tokens = tokenize(text, maxWidth);

        while (tokens.length) {
          // interpret tokenized opcode stream
          var token = tokens.shift();

          switch (token.type) {
            case TYPE_TEXT:
              var isSpace = false,
                  isPrevSpace = false,
                  isFullWidth = false,
                  isPrevFullWidth = false;

              for (var i = 0; i < token.value.length; i++) {
                var cc = token.value.charCodeAt(i);
                var c = token.value.charAt(i);

                if (this._options.layout === "term") {
                  var cch = cc >> 8;
                  var isCJK = cch === 0x11 || cch >= 0x2e && cch <= 0x9f || cch >= 0xac && cch <= 0xd7 || cc >= 0xA960 && cc <= 0xA97F;

                  if (isCJK) {
                    this.draw(cx + 0, cy, c, fg, bg);
                    this.draw(cx + 1, cy, "\t", fg, bg);
                    cx += 2;
                    continue;
                  }
                } // Assign to `true` when the current char is full-width.


                isFullWidth = cc > 0xff00 && cc < 0xff61 || cc > 0xffdc && cc < 0xffe8 || cc > 0xffee; // Current char is space, whatever full-width or half-width both are OK.

                isSpace = c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000; // The previous char is full-width and
                // current char is nether half-width nor a space.

                if (isPrevFullWidth && !isFullWidth && !isSpace) {
                  cx++;
                } // add an extra position
                // The current char is full-width and
                // the previous char is not a space.


                if (isFullWidth && !isPrevSpace) {
                  cx++;
                } // add an extra position


                this.draw(cx++, cy, c, fg, bg);
                isPrevSpace = isSpace;
                isPrevFullWidth = isFullWidth;
              }

              break;

            case TYPE_FG:
              fg = token.value || null;
              break;

            case TYPE_BG:
              bg = token.value || null;
              break;

            case TYPE_NEWLINE:
              cx = x;
              cy++;
              lines++;
              break;
          }
        }

        return lines;
      };
      /**
       * Timer tick: update dirty parts
       */


      _proto9._tick = function _tick() {
        this._backend.schedule(this._tick);

        if (!this._dirty) {
          return;
        }

        if (this._dirty === true) {
          // draw all
          this._backend.clear();

          for (var id in this._data) {
            this._draw(id, false);
          } // redraw cached data 

        } else {
          // draw only dirty 
          for (var key in this._dirty) {
            this._draw(key, true);
          }
        }

        this._dirty = false;
      };
      /**
       * @param {string} key What to draw
       * @param {bool} clearBefore Is it necessary to clean before?
       */


      _proto9._draw = function _draw(key, clearBefore) {
        var data = this._data[key];

        if (data[4] != this._options.bg) {
          clearBefore = true;
        }

        this._backend.draw(data, clearBefore);
      };

      return Display;
    }();

    Display.Rect = Rect;
    Display.Hex = Hex;
    Display.Tile = Tile;
    Display.TileGL = TileGL;
    Display.Term = Term;
    return Display;
  }();
  /**
   * @class (Markov process)-based string generator.
   * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
   * Offers configurable order and prior.
   */


  var StringGenerator =
  /*#__PURE__*/
  function () {
    function StringGenerator(options) {
      this._options = {
        words: false,
        order: 3,
        prior: 0.001
      };
      Object.assign(this._options, options);
      this._boundary = String.fromCharCode(0);
      this._suffix = this._boundary;
      this._prefix = [];

      for (var i = 0; i < this._options.order; i++) {
        this._prefix.push(this._boundary);
      }

      this._priorValues = {};
      this._priorValues[this._boundary] = this._options.prior;
      this._data = {};
    }
    /**
     * Remove all learning data
     */


    var _proto10 = StringGenerator.prototype;

    _proto10.clear = function clear() {
      this._data = {};
      this._priorValues = {};
    };
    /**
     * @returns {string} Generated string
     */


    _proto10.generate = function generate() {
      var result = [this._sample(this._prefix)];

      while (result[result.length - 1] != this._boundary) {
        result.push(this._sample(result));
      }

      return this._join(result.slice(0, -1));
    };
    /**
     * Observe (learn) a string from a training set
     */


    _proto10.observe = function observe(string) {
      var tokens = this._split(string);

      for (var i = 0; i < tokens.length; i++) {
        this._priorValues[tokens[i]] = this._options.prior;
      }

      tokens = this._prefix.concat(tokens).concat(this._suffix);
      /* add boundary symbols */

      for (var _i2 = this._options.order; _i2 < tokens.length; _i2++) {
        var context = tokens.slice(_i2 - this._options.order, _i2);
        var event = tokens[_i2];

        for (var j = 0; j < context.length; j++) {
          var subcontext = context.slice(j);

          this._observeEvent(subcontext, event);
        }
      }
    };

    _proto10.getStats = function getStats() {
      var parts = [];
      var priorCount = Object.keys(this._priorValues).length;
      priorCount--; // boundary

      parts.push("distinct samples: " + priorCount);
      var dataCount = Object.keys(this._data).length;
      var eventCount = 0;

      for (var p in this._data) {
        eventCount += Object.keys(this._data[p]).length;
      }

      parts.push("dictionary size (contexts): " + dataCount);
      parts.push("dictionary size (events): " + eventCount);
      return parts.join(", ");
    };
    /**
     * @param {string}
     * @returns {string[]}
     */


    _proto10._split = function _split(str) {
      return str.split(this._options.words ? /\s+/ : "");
    };
    /**
     * @param {string[]}
     * @returns {string}
     */


    _proto10._join = function _join(arr) {
      return arr.join(this._options.words ? " " : "");
    };
    /**
     * @param {string[]} context
     * @param {string} event
     */


    _proto10._observeEvent = function _observeEvent(context, event) {
      var key = this._join(context);

      if (!(key in this._data)) {
        this._data[key] = {};
      }

      var data = this._data[key];

      if (!(event in data)) {
        data[event] = 0;
      }

      data[event]++;
    };
    /**
     * @param {string[]}
     * @returns {string}
     */


    _proto10._sample = function _sample(context) {
      context = this._backoff(context);

      var key = this._join(context);

      var data = this._data[key];
      var available = {};

      if (this._options.prior) {
        for (var event in this._priorValues) {
          available[event] = this._priorValues[event];
        }

        for (var _event in data) {
          available[_event] += data[_event];
        }
      } else {
        available = data;
      }

      return RNG$1.getWeightedValue(available);
    };
    /**
     * @param {string[]}
     * @returns {string[]}
     */


    _proto10._backoff = function _backoff(context) {
      if (context.length > this._options.order) {
        context = context.slice(-this._options.order);
      } else if (context.length < this._options.order) {
        context = this._prefix.slice(0, this._options.order - context.length).concat(context);
      }

      while (!(this._join(context) in this._data) && context.length > 0) {
        context = context.slice(1);
      }

      return context;
    };

    return StringGenerator;
  }();

  var MinHeap =
  /*#__PURE__*/
  function () {
    function MinHeap() {
      this.heap = [];
      this.timestamp = 0;
    }

    var _proto11 = MinHeap.prototype;

    _proto11.lessThan = function lessThan(a, b) {
      return a.key == b.key ? a.timestamp < b.timestamp : a.key < b.key;
    };

    _proto11.shift = function shift(v) {
      this.heap = this.heap.map(function (_ref) {
        var key = _ref.key,
            value = _ref.value,
            timestamp = _ref.timestamp;
        return {
          key: key + v,
          value: value,
          timestamp: timestamp
        };
      });
    };

    _proto11.len = function len() {
      return this.heap.length;
    };

    _proto11.push = function push(value, key) {
      this.timestamp += 1;
      var loc = this.len();
      this.heap.push({
        value: value,
        timestamp: this.timestamp,
        key: key
      });
      this.updateUp(loc);
    };

    _proto11.pop = function pop() {
      if (this.len() == 0) {
        throw new Error("no element to pop");
      }

      var top = this.heap[0];

      if (this.len() > 1) {
        this.heap[0] = this.heap.pop();
        this.updateDown(0);
      } else {
        this.heap.pop();
      }

      return top;
    };

    _proto11.find = function find(v) {
      for (var i = 0; i < this.len(); i++) {
        if (v == this.heap[i].value) {
          return this.heap[i];
        }
      }

      return null;
    };

    _proto11.remove = function remove(v) {
      var index = null;

      for (var i = 0; i < this.len(); i++) {
        if (v == this.heap[i].value) {
          index = i;
        }
      }

      if (index === null) {
        return false;
      }

      if (this.len() > 1) {
        var last = this.heap.pop();

        if (last.value != v) {
          // if the last one is being removed, do nothing
          this.heap[index] = last;
          this.updateDown(index);
        }

        return true;
      } else {
        this.heap.pop();
      }

      return true;
    };

    _proto11.parentNode = function parentNode(x) {
      return Math.floor((x - 1) / 2);
    };

    _proto11.leftChildNode = function leftChildNode(x) {
      return 2 * x + 1;
    };

    _proto11.rightChildNode = function rightChildNode(x) {
      return 2 * x + 2;
    };

    _proto11.existNode = function existNode(x) {
      return x >= 0 && x < this.heap.length;
    };

    _proto11.swap = function swap(x, y) {
      var t = this.heap[x];
      this.heap[x] = this.heap[y];
      this.heap[y] = t;
    };

    _proto11.minNode = function minNode(numbers) {
      var validnumbers = numbers.filter(this.existNode.bind(this));
      var minimal = validnumbers[0];

      for (var _iterator = validnumbers, _isArray = Array.isArray(_iterator), _i3 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray) {
          if (_i3 >= _iterator.length) break;
          _ref2 = _iterator[_i3++];
        } else {
          _i3 = _iterator.next();
          if (_i3.done) break;
          _ref2 = _i3.value;
        }

        var i = _ref2;

        if (this.lessThan(this.heap[i], this.heap[minimal])) {
          minimal = i;
        }
      }

      return minimal;
    };

    _proto11.updateUp = function updateUp(x) {
      if (x == 0) {
        return;
      }

      var parent = this.parentNode(x);

      if (this.existNode(parent) && this.lessThan(this.heap[x], this.heap[parent])) {
        this.swap(x, parent);
        this.updateUp(parent);
      }
    };

    _proto11.updateDown = function updateDown(x) {
      var leftChild = this.leftChildNode(x);
      var rightChild = this.rightChildNode(x);

      if (!this.existNode(leftChild)) {
        return;
      }

      var m = this.minNode([x, leftChild, rightChild]);

      if (m != x) {
        this.swap(x, m);
        this.updateDown(m);
      }
    };

    _proto11.debugPrint = function debugPrint() {
      console.log(this.heap);
    };

    return MinHeap;
  }();

  var EventQueue =
  /*#__PURE__*/
  function () {
    /**
     * @class Generic event queue: stores events and retrieves them based on their time
     */
    function EventQueue() {
      this._time = 0;
      this._events = new MinHeap();
    }
    /**
     * @returns {number} Elapsed time
     */


    var _proto12 = EventQueue.prototype;

    _proto12.getTime = function getTime() {
      return this._time;
    };
    /**
     * Clear all scheduled events
     */


    _proto12.clear = function clear() {
      this._events = new MinHeap();
      return this;
    };
    /**
     * @param {?} event
     * @param {number} time
     */


    _proto12.add = function add(event, time) {
      this._events.push(event, time);
    };
    /**
     * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
     * @returns {? || null} The event previously added by addEvent, null if no event available
     */


    _proto12.get = function get() {
      if (!this._events.len()) {
        return null;
      }

      var _this$_events$pop = this._events.pop(),
          time = _this$_events$pop.key,
          event = _this$_events$pop.value;

      if (time > 0) {
        /* advance */
        this._time += time;

        this._events.shift(-time);
      }

      return event;
    };
    /**
     * Get the time associated with the given event
     * @param {?} event
     * @returns {number} time
     */


    _proto12.getEventTime = function getEventTime(event) {
      var r = this._events.find(event);

      if (r) {
        var key = r.key;
        return key;
      }

      return undefined;
    };
    /**
     * Remove an event from the queue
     * @param {?} event
     * @returns {bool} success?
     */


    _proto12.remove = function remove(event) {
      return this._events.remove(event);
    };

    return EventQueue;
  }();

  var Scheduler =
  /*#__PURE__*/
  function () {
    /**
     * @class Abstract scheduler
     */
    function Scheduler() {
      this._queue = new EventQueue();
      this._repeat = [];
      this._current = null;
    }
    /**
     * @see ROT.EventQueue#getTime
     */


    var _proto13 = Scheduler.prototype;

    _proto13.getTime = function getTime() {
      return this._queue.getTime();
    };
    /**
     * @param {?} item
     * @param {bool} repeat
     */


    _proto13.add = function add(item, repeat) {
      if (repeat) {
        this._repeat.push(item);
      }

      return this;
    };
    /**
     * Get the time the given item is scheduled for
     * @param {?} item
     * @returns {number} time
     */


    _proto13.getTimeOf = function getTimeOf(item) {
      return this._queue.getEventTime(item);
    };
    /**
     * Clear all items
     */


    _proto13.clear = function clear() {
      this._queue.clear();

      this._repeat = [];
      this._current = null;
      return this;
    };
    /**
     * Remove a previously added item
     * @param {?} item
     * @returns {bool} successful?
     */


    _proto13.remove = function remove(item) {
      var result = this._queue.remove(item);

      var index = this._repeat.indexOf(item);

      if (index != -1) {
        this._repeat.splice(index, 1);
      }

      if (this._current == item) {
        this._current = null;
      }

      return result;
    };
    /**
     * Schedule next item
     * @returns {?}
     */


    _proto13.next = function next() {
      this._current = this._queue.get();
      return this._current;
    };

    return Scheduler;
  }();
  /**
   * @class Simple fair scheduler (round-robin style)
   */


  var Simple =
  /*#__PURE__*/
  function (_Scheduler) {
    _inheritsLoose(Simple, _Scheduler);

    function Simple() {
      return _Scheduler.apply(this, arguments) || this;
    }

    var _proto14 = Simple.prototype;

    _proto14.add = function add(item, repeat) {
      this._queue.add(item, 0);

      return _Scheduler.prototype.add.call(this, item, repeat);
    };

    _proto14.next = function next() {
      if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
        this._queue.add(this._current, 0);
      }

      return _Scheduler.prototype.next.call(this);
    };

    return Simple;
  }(Scheduler);
  /**
   * @class Speed-based scheduler
   */


  var Speed =
  /*#__PURE__*/
  function (_Scheduler2) {
    _inheritsLoose(Speed, _Scheduler2);

    function Speed() {
      return _Scheduler2.apply(this, arguments) || this;
    }

    var _proto15 = Speed.prototype;

    /**
     * @param {object} item anything with "getSpeed" method
     * @param {bool} repeat
     * @param {number} [time=1/item.getSpeed()]
     * @see ROT.Scheduler#add
     */
    _proto15.add = function add(item, repeat, time) {
      this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());

      return _Scheduler2.prototype.add.call(this, item, repeat);
    };
    /**
     * @see ROT.Scheduler#next
     */


    _proto15.next = function next() {
      if (this._current && this._repeat.indexOf(this._current) != -1) {
        this._queue.add(this._current, 1 / this._current.getSpeed());
      }

      return _Scheduler2.prototype.next.call(this);
    };

    return Speed;
  }(Scheduler);
  /**
   * @class Action-based scheduler
   * @augments ROT.Scheduler
   */


  var Action =
  /*#__PURE__*/
  function (_Scheduler3) {
    _inheritsLoose(Action, _Scheduler3);

    function Action() {
      var _this9;

      _this9 = _Scheduler3.call(this) || this;
      _this9._defaultDuration = 1;
      /* for newly added */

      _this9._duration = _this9._defaultDuration;
      /* for this._current */

      return _this9;
    }
    /**
     * @param {object} item
     * @param {bool} repeat
     * @param {number} [time=1]
     * @see ROT.Scheduler#add
     */


    var _proto16 = Action.prototype;

    _proto16.add = function add(item, repeat, time) {
      this._queue.add(item, time || this._defaultDuration);

      return _Scheduler3.prototype.add.call(this, item, repeat);
    };

    _proto16.clear = function clear() {
      this._duration = this._defaultDuration;
      return _Scheduler3.prototype.clear.call(this);
    };

    _proto16.remove = function remove(item) {
      if (item == this._current) {
        this._duration = this._defaultDuration;
      }

      return _Scheduler3.prototype.remove.call(this, item);
    };
    /**
     * @see ROT.Scheduler#next
     */


    _proto16.next = function next() {
      if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
        this._queue.add(this._current, this._duration || this._defaultDuration);

        this._duration = this._defaultDuration;
      }

      return _Scheduler3.prototype.next.call(this);
    };
    /**
     * Set duration for the active item
     */


    _proto16.setDuration = function setDuration(time) {
      if (this._current) {
        this._duration = time;
      }

      return this;
    };

    return Action;
  }(Scheduler);

  var index = {
    Simple: Simple,
    Speed: Speed,
    Action: Action
  };

  var FOV =
  /*#__PURE__*/
  function () {
    /**
     * @class Abstract FOV algorithm
     * @param {function} lightPassesCallback Does the light pass through x,y?
     * @param {object} [options]
     * @param {int} [options.topology=8] 4/6/8
     */
    function FOV(lightPassesCallback, options) {
      if (options === void 0) {
        options = {};
      }

      this._lightPasses = lightPassesCallback;
      this._options = Object.assign({
        topology: 8
      }, options);
    }
    /**
     * Return all neighbors in a concentric ring
     * @param {int} cx center-x
     * @param {int} cy center-y
     * @param {int} r range
     */


    var _proto17 = FOV.prototype;

    _proto17._getCircle = function _getCircle(cx, cy, r) {
      var result = [];
      var dirs, countFactor, startOffset;

      switch (this._options.topology) {
        case 4:
          countFactor = 1;
          startOffset = [0, 1];
          dirs = [DIRS[8][7], DIRS[8][1], DIRS[8][3], DIRS[8][5]];
          break;

        case 6:
          dirs = DIRS[6];
          countFactor = 1;
          startOffset = [-1, 1];
          break;

        case 8:
          dirs = DIRS[4];
          countFactor = 2;
          startOffset = [-1, 1];
          break;

        default:
          throw new Error("Incorrect topology for FOV computation");
          break;
      }
      /* starting neighbor */


      var x = cx + startOffset[0] * r;
      var y = cy + startOffset[1] * r;
      /* circle */

      for (var i = 0; i < dirs.length; i++) {
        for (var j = 0; j < r * countFactor; j++) {
          result.push([x, y]);
          x += dirs[i][0];
          y += dirs[i][1];
        }
      }

      return result;
    };

    return FOV;
  }();
  /**
   * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
   * @augments ROT.FOV
   */


  var DiscreteShadowcasting =
  /*#__PURE__*/
  function (_FOV) {
    _inheritsLoose(DiscreteShadowcasting, _FOV);

    function DiscreteShadowcasting() {
      return _FOV.apply(this, arguments) || this;
    }

    var _proto18 = DiscreteShadowcasting.prototype;

    _proto18.compute = function compute(x, y, R, callback) {
      /* this place is always visible */
      callback(x, y, 0, 1);
      /* standing in a dark place. FIXME is this a good idea?  */

      if (!this._lightPasses(x, y)) {
        return;
      }
      /* start and end angles */


      var DATA = [];
      var A, B, cx, cy, blocks;
      /* analyze surrounding cells in concentric rings, starting from the center */

      for (var r = 1; r <= R; r++) {
        var neighbors = this._getCircle(x, y, r);

        var angle = 360 / neighbors.length;

        for (var i = 0; i < neighbors.length; i++) {
          cx = neighbors[i][0];
          cy = neighbors[i][1];
          A = angle * (i - 0.5);
          B = A + angle;
          blocks = !this._lightPasses(cx, cy);

          if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) {
            callback(cx, cy, r, 1);
          }

          if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) {
            return;
          }
          /* cutoff? */

        }
        /* for all cells in this ring */

      }
      /* for all rings */

    };
    /**
     * @param {int} A start angle
     * @param {int} B end angle
     * @param {bool} blocks Does current cell block visibility?
     * @param {int[][]} DATA shadowed angle pairs
     */


    _proto18._visibleCoords = function _visibleCoords(A, B, blocks, DATA) {
      if (A < 0) {
        var v1 = this._visibleCoords(0, B, blocks, DATA);

        var v2 = this._visibleCoords(360 + A, 360, blocks, DATA);

        return v1 || v2;
      }

      var index = 0;

      while (index < DATA.length && DATA[index] < A) {
        index++;
      }

      if (index == DATA.length) {
        /* completely new shadow */
        if (blocks) {
          DATA.push(A, B);
        }

        return true;
      }

      var count = 0;

      if (index % 2) {
        /* this shadow starts in an existing shadow, or within its ending boundary */
        while (index < DATA.length && DATA[index] < B) {
          index++;
          count++;
        }

        if (count == 0) {
          return false;
        }

        if (blocks) {
          if (count % 2) {
            DATA.splice(index - count, count, B);
          } else {
            DATA.splice(index - count, count);
          }
        }

        return true;
      } else {
        /* this shadow starts outside an existing shadow, or within a starting boundary */
        while (index < DATA.length && DATA[index] < B) {
          index++;
          count++;
        }
        /* visible when outside an existing shadow, or when overlapping */


        if (A == DATA[index - count] && count == 1) {
          return false;
        }

        if (blocks) {
          if (count % 2) {
            DATA.splice(index - count, count, A);
          } else {
            DATA.splice(index - count, count, A, B);
          }
        }

        return true;
      }
    };

    return DiscreteShadowcasting;
  }(FOV);
  /**
   * @class Precise shadowcasting algorithm
   * @augments ROT.FOV
   */


  var PreciseShadowcasting =
  /*#__PURE__*/
  function (_FOV2) {
    _inheritsLoose(PreciseShadowcasting, _FOV2);

    function PreciseShadowcasting() {
      return _FOV2.apply(this, arguments) || this;
    }

    var _proto19 = PreciseShadowcasting.prototype;

    _proto19.compute = function compute(x, y, R, callback) {
      /* this place is always visible */
      callback(x, y, 0, 1);
      /* standing in a dark place. FIXME is this a good idea?  */

      if (!this._lightPasses(x, y)) {
        return;
      }
      /* list of all shadows */


      var SHADOWS = [];
      var cx, cy, blocks, A1, A2, visibility;
      /* analyze surrounding cells in concentric rings, starting from the center */

      for (var r = 1; r <= R; r++) {
        var neighbors = this._getCircle(x, y, r);

        var neighborCount = neighbors.length;

        for (var i = 0; i < neighborCount; i++) {
          cx = neighbors[i][0];
          cy = neighbors[i][1];
          /* shift half-an-angle backwards to maintain consistency of 0-th cells */

          A1 = [i ? 2 * i - 1 : 2 * neighborCount - 1, 2 * neighborCount];
          A2 = [2 * i + 1, 2 * neighborCount];
          blocks = !this._lightPasses(cx, cy);
          visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);

          if (visibility) {
            callback(cx, cy, r, visibility);
          }

          if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) {
            return;
          }
          /* cutoff? */

        }
        /* for all cells in this ring */

      }
      /* for all rings */

    };
    /**
     * @param {int[2]} A1 arc start
     * @param {int[2]} A2 arc end
     * @param {bool} blocks Does current arc block visibility?
     * @param {int[][]} SHADOWS list of active shadows
     */


    _proto19._checkVisibility = function _checkVisibility(A1, A2, blocks, SHADOWS) {
      if (A1[0] > A2[0]) {
        /* split into two sub-arcs */
        var v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);

        var v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);

        return (v1 + v2) / 2;
      }
      /* index1: first shadow >= A1 */


      var index1 = 0,
          edge1 = false;

      while (index1 < SHADOWS.length) {
        var old = SHADOWS[index1];
        var diff = old[0] * A1[1] - A1[0] * old[1];

        if (diff >= 0) {
          /* old >= A1 */
          if (diff == 0 && !(index1 % 2)) {
            edge1 = true;
          }

          break;
        }

        index1++;
      }
      /* index2: last shadow <= A2 */


      var index2 = SHADOWS.length,
          edge2 = false;

      while (index2--) {
        var _old = SHADOWS[index2];

        var _diff = A2[0] * _old[1] - _old[0] * A2[1];

        if (_diff >= 0) {
          /* old <= A2 */
          if (_diff == 0 && index2 % 2) {
            edge2 = true;
          }

          break;
        }
      }

      var visible = true;

      if (index1 == index2 && (edge1 || edge2)) {
        /* subset of existing shadow, one of the edges match */
        visible = false;
      } else if (edge1 && edge2 && index1 + 1 == index2 && index2 % 2) {
        /* completely equivalent with existing shadow */
        visible = false;
      } else if (index1 > index2 && index1 % 2) {
        /* subset of existing shadow, not touching */
        visible = false;
      }

      if (!visible) {
        return 0;
      }
      /* fast case: not visible */


      var visibleLength;
      /* compute the length of visible arc, adjust list of shadows (if blocking) */

      var remove = index2 - index1 + 1;

      if (remove % 2) {
        if (index1 % 2) {
          /* first edge within existing shadow, second outside */
          var P = SHADOWS[index1];
          visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);

          if (blocks) {
            SHADOWS.splice(index1, remove, A2);
          }
        } else {
          /* second edge within existing shadow, first outside */
          var _P = SHADOWS[index2];
          visibleLength = (_P[0] * A1[1] - A1[0] * _P[1]) / (A1[1] * _P[1]);

          if (blocks) {
            SHADOWS.splice(index1, remove, A1);
          }
        }
      } else {
        if (index1 % 2) {
          /* both edges within existing shadows */
          var P1 = SHADOWS[index1];
          var P2 = SHADOWS[index2];
          visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);

          if (blocks) {
            SHADOWS.splice(index1, remove);
          }
        } else {
          /* both edges outside existing shadows */
          if (blocks) {
            SHADOWS.splice(index1, remove, A1, A2);
          }

          return 1;
          /* whole arc visible! */
        }
      }

      var arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
      return visibleLength / arcLength;
    };

    return PreciseShadowcasting;
  }(FOV);
  /** Octants used for translating recursive shadowcasting offsets */


  var OCTANTS = [[-1, 0, 0, 1], [0, -1, 1, 0], [0, -1, -1, 0], [-1, 0, 0, -1], [1, 0, 0, -1], [0, 1, -1, 0], [0, 1, 1, 0], [1, 0, 0, 1]];
  /**
   * @class Recursive shadowcasting algorithm
   * Currently only supports 4/8 topologies, not hexagonal.
   * Based on Peter Harkins' implementation of Bj├╢rn Bergstr├╢m's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
   * @augments ROT.FOV
   */

  var RecursiveShadowcasting =
  /*#__PURE__*/
  function (_FOV3) {
    _inheritsLoose(RecursiveShadowcasting, _FOV3);

    function RecursiveShadowcasting() {
      return _FOV3.apply(this, arguments) || this;
    }

    var _proto20 = RecursiveShadowcasting.prototype;

    /**
     * Compute visibility for a 360-degree circle
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */
    _proto20.compute = function compute(x, y, R, callback) {
      //You can always see your own tile
      callback(x, y, 0, 1);

      for (var i = 0; i < OCTANTS.length; i++) {
        this._renderOctant(x, y, OCTANTS[i], R, callback);
      }
    };
    /**
     * Compute visibility for a 180-degree arc
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
     * @param {function} callback
     */


    _proto20.compute180 = function compute180(x, y, R, dir, callback) {
      //You can always see your own tile
      callback(x, y, 0, 1);
      var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees

      var nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees

      var nextOctant = (dir + 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees

      this._renderOctant(x, y, OCTANTS[nextPreviousOctant], R, callback);

      this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);

      this._renderOctant(x, y, OCTANTS[dir], R, callback);

      this._renderOctant(x, y, OCTANTS[nextOctant], R, callback);
    };

    /**
     * Compute visibility for a 90-degree arc
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
     * @param {function} callback
     */
    _proto20.compute90 = function compute90(x, y, R, dir, callback) {
      //You can always see your own tile
      callback(x, y, 0, 1);
      var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees

      this._renderOctant(x, y, OCTANTS[dir], R, callback);

      this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
    };
    /**
     * Render one octant (45-degree arc) of the viewshed
     * @param {int} x
     * @param {int} y
     * @param {int} octant Octant to be rendered
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */


    _proto20._renderOctant = function _renderOctant(x, y, octant, R, callback) {
      //Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
      this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
    };
    /**
     * Actually calculates the visibility
     * @param {int} startX The starting X coordinate
     * @param {int} startY The starting Y coordinate
     * @param {int} row The row to render
     * @param {float} visSlopeStart The slope to start at
     * @param {float} visSlopeEnd The slope to end at
     * @param {int} radius The radius to reach out to
     * @param {int} xx
     * @param {int} xy
     * @param {int} yx
     * @param {int} yy
     * @param {function} callback The callback to use when we hit a block that is visible
     */


    _proto20._castVisibility = function _castVisibility(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
      if (visSlopeStart < visSlopeEnd) {
        return;
      }

      for (var i = row; i <= radius; i++) {
        var dx = -i - 1;
        var dy = -i;
        var blocked = false;
        var newStart = 0; //'Row' could be column, names here assume octant 0 and would be flipped for half the octants

        while (dx <= 0) {
          dx += 1; //Translate from relative coordinates to map coordinates

          var mapX = startX + dx * xx + dy * xy;
          var mapY = startY + dx * yx + dy * yy; //Range of the row

          var slopeStart = (dx - 0.5) / (dy + 0.5);
          var slopeEnd = (dx + 0.5) / (dy - 0.5); //Ignore if not yet at left edge of Octant

          if (slopeEnd > visSlopeStart) {
            continue;
          } //Done if past right edge


          if (slopeStart < visSlopeEnd) {
            break;
          } //If it's in range, it's visible


          if (dx * dx + dy * dy < radius * radius) {
            callback(mapX, mapY, i, 1);
          }

          if (!blocked) {
            //If tile is a blocking tile, cast around it
            if (!this._lightPasses(mapX, mapY) && i < radius) {
              blocked = true;

              this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);

              newStart = slopeEnd;
            }
          } else {
            //Keep narrowing if scanning across a block
            if (!this._lightPasses(mapX, mapY)) {
              newStart = slopeEnd;
              continue;
            } //Block has ended


            blocked = false;
            visSlopeStart = newStart;
          }
        }

        if (blocked) {
          break;
        }
      }
    };

    return RecursiveShadowcasting;
  }(FOV);

  var index$1 = {
    DiscreteShadowcasting: DiscreteShadowcasting,
    PreciseShadowcasting: PreciseShadowcasting,
    RecursiveShadowcasting: RecursiveShadowcasting
  };

  var Map =
  /*#__PURE__*/
  function () {
    /**
     * @class Base map generator
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     */
    function Map(width, height) {
      if (width === void 0) {
        width = DEFAULT_WIDTH;
      }

      if (height === void 0) {
        height = DEFAULT_HEIGHT;
      }

      this._width = width;
      this._height = height;
    }

    var _proto21 = Map.prototype;

    _proto21._fillMap = function _fillMap(value) {
      var map = [];

      for (var i = 0; i < this._width; i++) {
        map.push([]);

        for (var j = 0; j < this._height; j++) {
          map[i].push(value);
        }
      }

      return map;
    };

    return Map;
  }();
  /**
   * @class Simple empty rectangular room
   * @augments ROT.Map
   */


  var Arena =
  /*#__PURE__*/
  function (_Map) {
    _inheritsLoose(Arena, _Map);

    function Arena() {
      return _Map.apply(this, arguments) || this;
    }

    var _proto22 = Arena.prototype;

    _proto22.create = function create(callback) {
      var w = this._width - 1;
      var h = this._height - 1;

      for (var i = 0; i <= w; i++) {
        for (var j = 0; j <= h; j++) {
          var empty = i && j && i < w && j < h;
          callback(i, j, empty ? 0 : 1);
        }
      }

      return this;
    };

    return Arena;
  }(Map);
  /**
   * @class Dungeon map: has rooms and corridors
   * @augments ROT.Map
   */


  var Dungeon =
  /*#__PURE__*/
  function (_Map2) {
    _inheritsLoose(Dungeon, _Map2);

    function Dungeon(width, height) {
      var _this10;

      _this10 = _Map2.call(this, width, height) || this;
      _this10._rooms = [];
      _this10._corridors = [];
      return _this10;
    }
    /**
     * Get all generated rooms
     * @returns {ROT.Map.Feature.Room[]}
     */


    var _proto23 = Dungeon.prototype;

    _proto23.getRooms = function getRooms() {
      return this._rooms;
    };
    /**
     * Get all generated corridors
     * @returns {ROT.Map.Feature.Corridor[]}
     */


    _proto23.getCorridors = function getCorridors() {
      return this._corridors;
    };

    return Dungeon;
  }(Map);
  /**
   * @class Dungeon feature; has own .create() method
   */


  var Feature = function Feature() {};
  /**
   * @class Room
   * @augments ROT.Map.Feature
   * @param {int} x1
   * @param {int} y1
   * @param {int} x2
   * @param {int} y2
   * @param {int} [doorX]
   * @param {int} [doorY]
   */


  var Room =
  /*#__PURE__*/
  function (_Feature) {
    _inheritsLoose(Room, _Feature);

    function Room(x1, y1, x2, y2, doorX, doorY) {
      var _this11;

      _this11 = _Feature.call(this) || this;
      _this11._x1 = x1;
      _this11._y1 = y1;
      _this11._x2 = x2;
      _this11._y2 = y2;
      _this11._doors = {};

      if (doorX !== undefined && doorY !== undefined) {
        _this11.addDoor(doorX, doorY);
      }

      return _this11;
    }

    /**
     * Room of random size, with a given doors and direction
     */
    Room.createRandomAt = function createRandomAt(x, y, dx, dy, options) {
      var min = options.roomWidth[0];
      var max = options.roomWidth[1];
      var width = RNG$1.getUniformInt(min, max);
      min = options.roomHeight[0];
      max = options.roomHeight[1];
      var height = RNG$1.getUniformInt(min, max);

      if (dx == 1) {
        /* to the right */
        var y2 = y - Math.floor(RNG$1.getUniform() * height);
        return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
      }

      if (dx == -1) {
        /* to the left */
        var _y = y - Math.floor(RNG$1.getUniform() * height);

        return new this(x - width, _y, x - 1, _y + height - 1, x, y);
      }

      if (dy == 1) {
        /* to the bottom */
        var x2 = x - Math.floor(RNG$1.getUniform() * width);
        return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
      }

      if (dy == -1) {
        /* to the top */
        var _x = x - Math.floor(RNG$1.getUniform() * width);

        return new this(_x, y - height, _x + width - 1, y - 1, x, y);
      }

      throw new Error("dx or dy must be 1 or -1");
    };
    /**
     * Room of random size, positioned around center coords
     */


    Room.createRandomCenter = function createRandomCenter(cx, cy, options) {
      var min = options.roomWidth[0];
      var max = options.roomWidth[1];
      var width = RNG$1.getUniformInt(min, max);
      min = options.roomHeight[0];
      max = options.roomHeight[1];
      var height = RNG$1.getUniformInt(min, max);
      var x1 = cx - Math.floor(RNG$1.getUniform() * width);
      var y1 = cy - Math.floor(RNG$1.getUniform() * height);
      var x2 = x1 + width - 1;
      var y2 = y1 + height - 1;
      return new this(x1, y1, x2, y2);
    };
    /**
     * Room of random size within a given dimensions
     */


    Room.createRandom = function createRandom(availWidth, availHeight, options) {
      var min = options.roomWidth[0];
      var max = options.roomWidth[1];
      var width = RNG$1.getUniformInt(min, max);
      min = options.roomHeight[0];
      max = options.roomHeight[1];
      var height = RNG$1.getUniformInt(min, max);
      var left = availWidth - width - 1;
      var top = availHeight - height - 1;
      var x1 = 1 + Math.floor(RNG$1.getUniform() * left);
      var y1 = 1 + Math.floor(RNG$1.getUniform() * top);
      var x2 = x1 + width - 1;
      var y2 = y1 + height - 1;
      return new this(x1, y1, x2, y2);
    };

    var _proto24 = Room.prototype;

    _proto24.addDoor = function addDoor(x, y) {
      this._doors[x + "," + y] = 1;
      return this;
    };
    /**
     * @param {function}
     */


    _proto24.getDoors = function getDoors(cb) {
      for (var key in this._doors) {
        var parts = key.split(",");
        cb(parseInt(parts[0]), parseInt(parts[1]));
      }

      return this;
    };

    _proto24.clearDoors = function clearDoors() {
      this._doors = {};
      return this;
    };

    _proto24.addDoors = function addDoors(isWallCallback) {
      var left = this._x1 - 1;
      var right = this._x2 + 1;
      var top = this._y1 - 1;
      var bottom = this._y2 + 1;

      for (var x = left; x <= right; x++) {
        for (var y = top; y <= bottom; y++) {
          if (x != left && x != right && y != top && y != bottom) {
            continue;
          }

          if (isWallCallback(x, y)) {
            continue;
          }

          this.addDoor(x, y);
        }
      }

      return this;
    };

    _proto24.debug = function debug() {
      console.log("room", this._x1, this._y1, this._x2, this._y2);
    };

    _proto24.isValid = function isValid(isWallCallback, canBeDugCallback) {
      var left = this._x1 - 1;
      var right = this._x2 + 1;
      var top = this._y1 - 1;
      var bottom = this._y2 + 1;

      for (var x = left; x <= right; x++) {
        for (var y = top; y <= bottom; y++) {
          if (x == left || x == right || y == top || y == bottom) {
            if (!isWallCallback(x, y)) {
              return false;
            }
          } else {
            if (!canBeDugCallback(x, y)) {
              return false;
            }
          }
        }
      }

      return true;
    };
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
     */


    _proto24.create = function create(digCallback) {
      var left = this._x1 - 1;
      var right = this._x2 + 1;
      var top = this._y1 - 1;
      var bottom = this._y2 + 1;
      var value = 0;

      for (var x = left; x <= right; x++) {
        for (var y = top; y <= bottom; y++) {
          if (x + "," + y in this._doors) {
            value = 2;
          } else if (x == left || x == right || y == top || y == bottom) {
            value = 1;
          } else {
            value = 0;
          }

          digCallback(x, y, value);
        }
      }
    };

    _proto24.getCenter = function getCenter() {
      return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
    };

    _proto24.getLeft = function getLeft() {
      return this._x1;
    };

    _proto24.getRight = function getRight() {
      return this._x2;
    };

    _proto24.getTop = function getTop() {
      return this._y1;
    };

    _proto24.getBottom = function getBottom() {
      return this._y2;
    };

    return Room;
  }(Feature);
  /**
   * @class Corridor
   * @augments ROT.Map.Feature
   * @param {int} startX
   * @param {int} startY
   * @param {int} endX
   * @param {int} endY
   */


  var Corridor =
  /*#__PURE__*/
  function (_Feature2) {
    _inheritsLoose(Corridor, _Feature2);

    function Corridor(startX, startY, endX, endY) {
      var _this12;

      _this12 = _Feature2.call(this) || this;
      _this12._startX = startX;
      _this12._startY = startY;
      _this12._endX = endX;
      _this12._endY = endY;
      _this12._endsWithAWall = true;
      return _this12;
    }

    Corridor.createRandomAt = function createRandomAt(x, y, dx, dy, options) {
      var min = options.corridorLength[0];
      var max = options.corridorLength[1];
      var length = RNG$1.getUniformInt(min, max);
      return new this(x, y, x + dx * length, y + dy * length);
    };

    var _proto25 = Corridor.prototype;

    _proto25.debug = function debug() {
      console.log("corridor", this._startX, this._startY, this._endX, this._endY);
    };

    _proto25.isValid = function isValid(isWallCallback, canBeDugCallback) {
      var sx = this._startX;
      var sy = this._startY;
      var dx = this._endX - sx;
      var dy = this._endY - sy;
      var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

      if (dx) {
        dx = dx / Math.abs(dx);
      }

      if (dy) {
        dy = dy / Math.abs(dy);
      }

      var nx = dy;
      var ny = -dx;
      var ok = true;

      for (var i = 0; i < length; i++) {
        var x = sx + i * dx;
        var y = sy + i * dy;

        if (!canBeDugCallback(x, y)) {
          ok = false;
        }

        if (!isWallCallback(x + nx, y + ny)) {
          ok = false;
        }

        if (!isWallCallback(x - nx, y - ny)) {
          ok = false;
        }

        if (!ok) {
          length = i;
          this._endX = x - dx;
          this._endY = y - dy;
          break;
        }
      }
      /**
       * If the length degenerated, this corridor might be invalid
       */

      /* not supported */


      if (length == 0) {
        return false;
      }
      /* length 1 allowed only if the next space is empty */


      if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
        return false;
      }
      /**
       * We do not want the corridor to crash into a corner of a room;
       * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
       *
       * Situation:
       * #######1
       * .......?
       * #######2
       *
       * The corridor was dug from left to right.
       * 1, 2 - problematic corners, ? = N+1th cell (not dug)
       */


      var firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
      var secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
      this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);

      if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
        return false;
      }

      return true;
    };
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
     */


    _proto25.create = function create(digCallback) {
      var sx = this._startX;
      var sy = this._startY;
      var dx = this._endX - sx;
      var dy = this._endY - sy;
      var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

      if (dx) {
        dx = dx / Math.abs(dx);
      }

      if (dy) {
        dy = dy / Math.abs(dy);
      }

      for (var i = 0; i < length; i++) {
        var x = sx + i * dx;
        var y = sy + i * dy;
        digCallback(x, y, 0);
      }

      return true;
    };

    _proto25.createPriorityWalls = function createPriorityWalls(priorityWallCallback) {
      if (!this._endsWithAWall) {
        return;
      }

      var sx = this._startX;
      var sy = this._startY;
      var dx = this._endX - sx;
      var dy = this._endY - sy;

      if (dx) {
        dx = dx / Math.abs(dx);
      }

      if (dy) {
        dy = dy / Math.abs(dy);
      }

      var nx = dy;
      var ny = -dx;
      priorityWallCallback(this._endX + dx, this._endY + dy);
      priorityWallCallback(this._endX + nx, this._endY + ny);
      priorityWallCallback(this._endX - nx, this._endY - ny);
    };

    return Corridor;
  }(Feature);
  /**
   * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
   * @augments ROT.Map.Dungeon
   */


  var Uniform =
  /*#__PURE__*/
  function (_Dungeon) {
    _inheritsLoose(Uniform, _Dungeon);

    function Uniform(width, height, options) {
      var _this13;

      _this13 = _Dungeon.call(this, width, height) || this;
      _this13._options = {
        roomWidth: [3, 9],
        roomHeight: [3, 5],
        roomDugPercentage: 0.1,
        timeLimit: 1000
        /* we stop after this much time has passed (msec) */

      };
      Object.assign(_this13._options, options);
      _this13._map = [];
      _this13._dug = 0;
      _this13._roomAttempts = 20;
      /* new room is created N-times until is considered as impossible to generate */

      _this13._corridorAttempts = 20;
      /* corridors are tried N-times until the level is considered as impossible to connect */

      _this13._connected = [];
      /* list of already connected rooms */

      _this13._unconnected = [];
      /* list of remaining unconnected rooms */

      _this13._digCallback = _this13._digCallback.bind(_assertThisInitialized(_assertThisInitialized(_this13)));
      _this13._canBeDugCallback = _this13._canBeDugCallback.bind(_assertThisInitialized(_assertThisInitialized(_this13)));
      _this13._isWallCallback = _this13._isWallCallback.bind(_assertThisInitialized(_assertThisInitialized(_this13)));
      return _this13;
    }
    /**
     * Create a map. If the time limit has been hit, returns null.
     * @see ROT.Map#create
     */


    var _proto26 = Uniform.prototype;

    _proto26.create = function create(callback) {
      var t1 = Date.now();

      while (1) {
        var t2 = Date.now();

        if (t2 - t1 > this._options.timeLimit) {
          return null;
        }
        /* time limit! */


        this._map = this._fillMap(1);
        this._dug = 0;
        this._rooms = [];
        this._unconnected = [];

        this._generateRooms();

        if (this._rooms.length < 2) {
          continue;
        }

        if (this._generateCorridors()) {
          break;
        }
      }

      if (callback) {
        for (var i = 0; i < this._width; i++) {
          for (var j = 0; j < this._height; j++) {
            callback(i, j, this._map[i][j]);
          }
        }
      }

      return this;
    };
    /**
     * Generates a suitable amount of rooms
     */


    _proto26._generateRooms = function _generateRooms() {
      var w = this._width - 2;
      var h = this._height - 2;
      var room;

      do {
        room = this._generateRoom();

        if (this._dug / (w * h) > this._options.roomDugPercentage) {
          break;
        }
        /* achieved requested amount of free space */

      } while (room);
      /* either enough rooms, or not able to generate more of them :) */

    };
    /**
     * Try to generate one room
     */


    _proto26._generateRoom = function _generateRoom() {
      var count = 0;

      while (count < this._roomAttempts) {
        count++;
        var room = Room.createRandom(this._width, this._height, this._options);

        if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
          continue;
        }

        room.create(this._digCallback);

        this._rooms.push(room);

        return room;
      }
      /* no room was generated in a given number of attempts */


      return null;
    };
    /**
     * Generates connectors beween rooms
     * @returns {bool} success Was this attempt successfull?
     */


    _proto26._generateCorridors = function _generateCorridors() {
      var cnt = 0;

      while (cnt < this._corridorAttempts) {
        cnt++;
        this._corridors = [];
        /* dig rooms into a clear map */

        this._map = this._fillMap(1);

        for (var i = 0; i < this._rooms.length; i++) {
          var room = this._rooms[i];
          room.clearDoors();
          room.create(this._digCallback);
        }

        this._unconnected = RNG$1.shuffle(this._rooms.slice());
        this._connected = [];

        if (this._unconnected.length) {
          this._connected.push(this._unconnected.pop());
        }
        /* first one is always connected */


        while (1) {
          /* 1. pick random connected room */
          var connected = RNG$1.getItem(this._connected);

          if (!connected) {
            break;
          }
          /* 2. find closest unconnected */


          var room1 = this._closestRoom(this._unconnected, connected);

          if (!room1) {
            break;
          }
          /* 3. connect it to closest connected */


          var room2 = this._closestRoom(this._connected, room1);

          if (!room2) {
            break;
          }

          var ok = this._connectRooms(room1, room2);

          if (!ok) {
            break;
          }
          /* stop connecting, re-shuffle */


          if (!this._unconnected.length) {
            return true;
          }
          /* done; no rooms remain */

        }
      }

      return false;
    };

    /**
     * For a given room, find the closest one from the list
     */
    _proto26._closestRoom = function _closestRoom(rooms, room) {
      var dist = Infinity;
      var center = room.getCenter();
      var result = null;

      for (var i = 0; i < rooms.length; i++) {
        var r = rooms[i];
        var c = r.getCenter();
        var dx = c[0] - center[0];
        var dy = c[1] - center[1];
        var d = dx * dx + dy * dy;

        if (d < dist) {
          dist = d;
          result = r;
        }
      }

      return result;
    };

    _proto26._connectRooms = function _connectRooms(room1, room2) {
      /*
          room1.debug();
          room2.debug();
      */
      var center1 = room1.getCenter();
      var center2 = room2.getCenter();
      var diffX = center2[0] - center1[0];
      var diffY = center2[1] - center1[1];
      var start;
      var end;
      var dirIndex1, dirIndex2, min, max, index;

      if (Math.abs(diffX) < Math.abs(diffY)) {
        /* first try connecting north-south walls */
        dirIndex1 = diffY > 0 ? 2 : 0;
        dirIndex2 = (dirIndex1 + 2) % 4;
        min = room2.getLeft();
        max = room2.getRight();
        index = 0;
      } else {
        /* first try connecting east-west walls */
        dirIndex1 = diffX > 0 ? 1 : 3;
        dirIndex2 = (dirIndex1 + 2) % 4;
        min = room2.getTop();
        max = room2.getBottom();
        index = 1;
      }

      start = this._placeInWall(room1, dirIndex1);
      /* corridor will start here */

      if (!start) {
        return false;
      }

      if (start[index] >= min && start[index] <= max) {
        /* possible to connect with straight line (I-like) */
        end = start.slice();
        var value = 0;

        switch (dirIndex2) {
          case 0:
            value = room2.getTop() - 1;
            break;

          case 1:
            value = room2.getRight() + 1;
            break;

          case 2:
            value = room2.getBottom() + 1;
            break;

          case 3:
            value = room2.getLeft() - 1;
            break;
        }

        end[(index + 1) % 2] = value;

        this._digLine([start, end]);
      } else if (start[index] < min - 1 || start[index] > max + 1) {
        /* need to switch target wall (L-like) */
        var diff = start[index] - center2[index];
        var rotation = 0;

        switch (dirIndex2) {
          case 0:
          case 1:
            rotation = diff < 0 ? 3 : 1;
            break;

          case 2:
          case 3:
            rotation = diff < 0 ? 1 : 3;
            break;
        }

        dirIndex2 = (dirIndex2 + rotation) % 4;
        end = this._placeInWall(room2, dirIndex2);

        if (!end) {
          return false;
        }

        var mid = [0, 0];
        mid[index] = start[index];
        var index2 = (index + 1) % 2;
        mid[index2] = end[index2];

        this._digLine([start, mid, end]);
      } else {
        /* use current wall pair, but adjust the line in the middle (S-like) */
        var _index4 = (index + 1) % 2;

        end = this._placeInWall(room2, dirIndex2);

        if (!end) {
          return false;
        }

        var _mid = Math.round((end[_index4] + start[_index4]) / 2);

        var mid1 = [0, 0];
        var mid2 = [0, 0];
        mid1[index] = start[index];
        mid1[_index4] = _mid;
        mid2[index] = end[index];
        mid2[_index4] = _mid;

        this._digLine([start, mid1, mid2, end]);
      }

      room1.addDoor(start[0], start[1]);
      room2.addDoor(end[0], end[1]);
      index = this._unconnected.indexOf(room1);

      if (index != -1) {
        this._unconnected.splice(index, 1);

        this._connected.push(room1);
      }

      index = this._unconnected.indexOf(room2);

      if (index != -1) {
        this._unconnected.splice(index, 1);

        this._connected.push(room2);
      }

      return true;
    };

    _proto26._placeInWall = function _placeInWall(room, dirIndex) {
      var start = [0, 0];
      var dir = [0, 0];
      var length = 0;

      switch (dirIndex) {
        case 0:
          dir = [1, 0];
          start = [room.getLeft(), room.getTop() - 1];
          length = room.getRight() - room.getLeft() + 1;
          break;

        case 1:
          dir = [0, 1];
          start = [room.getRight() + 1, room.getTop()];
          length = room.getBottom() - room.getTop() + 1;
          break;

        case 2:
          dir = [1, 0];
          start = [room.getLeft(), room.getBottom() + 1];
          length = room.getRight() - room.getLeft() + 1;
          break;

        case 3:
          dir = [0, 1];
          start = [room.getLeft() - 1, room.getTop()];
          length = room.getBottom() - room.getTop() + 1;
          break;
      }

      var avail = [];
      var lastBadIndex = -2;

      for (var i = 0; i < length; i++) {
        var x = start[0] + i * dir[0];
        var y = start[1] + i * dir[1];
        avail.push(null);
        var isWall = this._map[x][y] == 1;

        if (isWall) {
          if (lastBadIndex != i - 1) {
            avail[i] = [x, y];
          }
        } else {
          lastBadIndex = i;

          if (i) {
            avail[i - 1] = null;
          }
        }
      }

      for (var _i4 = avail.length - 1; _i4 >= 0; _i4--) {
        if (!avail[_i4]) {
          avail.splice(_i4, 1);
        }
      }

      return avail.length ? RNG$1.getItem(avail) : null;
    };
    /**
     * Dig a polyline.
     */


    _proto26._digLine = function _digLine(points) {
      for (var i = 1; i < points.length; i++) {
        var start = points[i - 1];
        var end = points[i];
        var corridor = new Corridor(start[0], start[1], end[0], end[1]);
        corridor.create(this._digCallback);

        this._corridors.push(corridor);
      }
    };

    _proto26._digCallback = function _digCallback(x, y, value) {
      this._map[x][y] = value;

      if (value == 0) {
        this._dug++;
      }
    };

    _proto26._isWallCallback = function _isWallCallback(x, y) {
      if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
        return false;
      }

      return this._map[x][y] == 1;
    };

    _proto26._canBeDugCallback = function _canBeDugCallback(x, y) {
      if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
        return false;
      }

      return this._map[x][y] == 1;
    };

    return Uniform;
  }(Dungeon);
  /**
   * @class Cellular automaton map generator
   * @augments ROT.Map
   * @param {int} [width=ROT.DEFAULT_WIDTH]
   * @param {int} [height=ROT.DEFAULT_HEIGHT]
   * @param {object} [options] Options
   * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
   * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
   * @param {int} [options.topology] Topology 4 or 6 or 8
   */


  var Cellular =
  /*#__PURE__*/
  function (_Map3) {
    _inheritsLoose(Cellular, _Map3);

    function Cellular(width, height, options) {
      var _this14;

      if (options === void 0) {
        options = {};
      }

      _this14 = _Map3.call(this, width, height) || this;
      _this14._options = {
        born: [5, 6, 7, 8],
        survive: [4, 5, 6, 7, 8],
        topology: 8
      };

      _this14.setOptions(options);

      _this14._dirs = DIRS[_this14._options.topology];
      _this14._map = _this14._fillMap(0);
      return _this14;
    }
    /**
     * Fill the map with random values
     * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
     */


    var _proto27 = Cellular.prototype;

    _proto27.randomize = function randomize(probability) {
      for (var i = 0; i < this._width; i++) {
        for (var j = 0; j < this._height; j++) {
          this._map[i][j] = RNG$1.getUniform() < probability ? 1 : 0;
        }
      }

      return this;
    };
    /**
     * Change options.
     * @see ROT.Map.Cellular
     */


    _proto27.setOptions = function setOptions(options) {
      Object.assign(this._options, options);
    };

    _proto27.set = function set(x, y, value) {
      this._map[x][y] = value;
    };

    _proto27.create = function create(callback) {
      var newMap = this._fillMap(0);

      var born = this._options.born;
      var survive = this._options.survive;

      for (var j = 0; j < this._height; j++) {
        var widthStep = 1;
        var widthStart = 0;

        if (this._options.topology == 6) {
          widthStep = 2;
          widthStart = j % 2;
        }

        for (var i = widthStart; i < this._width; i += widthStep) {
          var cur = this._map[i][j];

          var ncount = this._getNeighbors(i, j);

          if (cur && survive.indexOf(ncount) != -1) {
            /* survive */
            newMap[i][j] = 1;
          } else if (!cur && born.indexOf(ncount) != -1) {
            /* born */
            newMap[i][j] = 1;
          }
        }
      }

      this._map = newMap;
      callback && this._serviceCallback(callback);
    };

    _proto27._serviceCallback = function _serviceCallback(callback) {
      for (var j = 0; j < this._height; j++) {
        var widthStep = 1;
        var widthStart = 0;

        if (this._options.topology == 6) {
          widthStep = 2;
          widthStart = j % 2;
        }

        for (var i = widthStart; i < this._width; i += widthStep) {
          callback(i, j, this._map[i][j]);
        }
      }
    };
    /**
     * Get neighbor count at [i,j] in this._map
     */


    _proto27._getNeighbors = function _getNeighbors(cx, cy) {
      var result = 0;

      for (var i = 0; i < this._dirs.length; i++) {
        var dir = this._dirs[i];
        var x = cx + dir[0];
        var y = cy + dir[1];

        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
          continue;
        }

        result += this._map[x][y] == 1 ? 1 : 0;
      }

      return result;
    };
    /**
     * Make sure every non-wall space is accessible.
     * @param {function} callback to call to display map when do
     * @param {int} value to consider empty space - defaults to 0
     * @param {function} callback to call when a new connection is made
     */


    _proto27.connect = function connect(callback, value, connectionCallback) {
      if (!value) value = 0;
      var allFreeSpace = [];
      var notConnected = {}; // find all free space

      var widthStep = 1;
      var widthStarts = [0, 0];

      if (this._options.topology == 6) {
        widthStep = 2;
        widthStarts = [0, 1];
      }

      for (var y = 0; y < this._height; y++) {
        for (var x = widthStarts[y % 2]; x < this._width; x += widthStep) {
          if (this._freeSpace(x, y, value)) {
            var p = [x, y];
            notConnected[this._pointKey(p)] = p;
            allFreeSpace.push([x, y]);
          }
        }
      }

      var start = allFreeSpace[RNG$1.getUniformInt(0, allFreeSpace.length - 1)];

      var key = this._pointKey(start);

      var connected = {};
      connected[key] = start;
      delete notConnected[key]; // find what's connected to the starting point

      this._findConnected(connected, notConnected, [start], false, value);

      while (Object.keys(notConnected).length > 0) {
        // find two points from notConnected to connected
        var _p = this._getFromTo(connected, notConnected);

        var from = _p[0]; // notConnected

        var to = _p[1]; // connected
        // find everything connected to the starting point

        var local = {};
        local[this._pointKey(from)] = from;

        this._findConnected(local, notConnected, [from], true, value); // connect to a connected cell


        var tunnelFn = this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected;
        tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback); // now all of local is connected

        for (var k in local) {
          var pp = local[k];
          this._map[pp[0]][pp[1]] = value;
          connected[k] = pp;
          delete notConnected[k];
        }
      }

      callback && this._serviceCallback(callback);
    };
    /**
     * Find random points to connect. Search for the closest point in the larger space.
     * This is to minimize the length of the passage while maintaining good performance.
     */


    _proto27._getFromTo = function _getFromTo(connected, notConnected) {
      var from = [0, 0],
          to = [0, 0],
          d;
      var connectedKeys = Object.keys(connected);
      var notConnectedKeys = Object.keys(notConnected);

      for (var i = 0; i < 5; i++) {
        if (connectedKeys.length < notConnectedKeys.length) {
          var keys = connectedKeys;
          to = connected[keys[RNG$1.getUniformInt(0, keys.length - 1)]];
          from = this._getClosest(to, notConnected);
        } else {
          var _keys = notConnectedKeys;
          from = notConnected[_keys[RNG$1.getUniformInt(0, _keys.length - 1)]];
          to = this._getClosest(from, connected);
        }

        d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);

        if (d < 64) {
          break;
        }
      } // console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);


      return [from, to];
    };

    _proto27._getClosest = function _getClosest(point, space) {
      var minPoint = null;
      var minDist = null;

      for (var k in space) {
        var p = space[k];
        var d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);

        if (minDist == null || d < minDist) {
          minDist = d;
          minPoint = p;
        }
      }

      return minPoint;
    };

    _proto27._findConnected = function _findConnected(connected, notConnected, stack, keepNotConnected, value) {
      while (stack.length > 0) {
        var p = stack.splice(0, 1)[0];
        var tests = void 0;

        if (this._options.topology == 6) {
          tests = [[p[0] + 2, p[1]], [p[0] + 1, p[1] - 1], [p[0] - 1, p[1] - 1], [p[0] - 2, p[1]], [p[0] - 1, p[1] + 1], [p[0] + 1, p[1] + 1]];
        } else {
          tests = [[p[0] + 1, p[1]], [p[0] - 1, p[1]], [p[0], p[1] + 1], [p[0], p[1] - 1]];
        }

        for (var i = 0; i < tests.length; i++) {
          var key = this._pointKey(tests[i]);

          if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
            connected[key] = tests[i];

            if (!keepNotConnected) {
              delete notConnected[key];
            }

            stack.push(tests[i]);
          }
        }
      }
    };

    _proto27._tunnelToConnected = function _tunnelToConnected(to, from, connected, notConnected, value, connectionCallback) {
      var a, b;

      if (from[0] < to[0]) {
        a = from;
        b = to;
      } else {
        a = to;
        b = from;
      }

      for (var xx = a[0]; xx <= b[0]; xx++) {
        this._map[xx][a[1]] = value;
        var p = [xx, a[1]];

        var pkey = this._pointKey(p);

        connected[pkey] = p;
        delete notConnected[pkey];
      }

      if (connectionCallback && a[0] < b[0]) {
        connectionCallback(a, [b[0], a[1]]);
      } // x is now fixed


      var x = b[0];

      if (from[1] < to[1]) {
        a = from;
        b = to;
      } else {
        a = to;
        b = from;
      }

      for (var yy = a[1]; yy < b[1]; yy++) {
        this._map[x][yy] = value;
        var _p2 = [x, yy];

        var _pkey = this._pointKey(_p2);

        connected[_pkey] = _p2;
        delete notConnected[_pkey];
      }

      if (connectionCallback && a[1] < b[1]) {
        connectionCallback([b[0], a[1]], [b[0], b[1]]);
      }
    };

    _proto27._tunnelToConnected6 = function _tunnelToConnected6(to, from, connected, notConnected, value, connectionCallback) {
      var a, b;

      if (from[0] < to[0]) {
        a = from;
        b = to;
      } else {
        a = to;
        b = from;
      } // tunnel diagonally until horizontally level


      var xx = a[0];
      var yy = a[1];

      while (!(xx == b[0] && yy == b[1])) {
        var stepWidth = 2;

        if (yy < b[1]) {
          yy++;
          stepWidth = 1;
        } else if (yy > b[1]) {
          yy--;
          stepWidth = 1;
        }

        if (xx < b[0]) {
          xx += stepWidth;
        } else if (xx > b[0]) {
          xx -= stepWidth;
        } else if (b[1] % 2) {
          // Won't step outside map if destination on is map's right edge
          xx -= stepWidth;
        } else {
          // ditto for left edge
          xx += stepWidth;
        }

        this._map[xx][yy] = value;
        var p = [xx, yy];

        var pkey = this._pointKey(p);

        connected[pkey] = p;
        delete notConnected[pkey];
      }

      if (connectionCallback) {
        connectionCallback(from, to);
      }
    };

    _proto27._freeSpace = function _freeSpace(x, y, value) {
      return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
    };

    _proto27._pointKey = function _pointKey(p) {
      return p[0] + "." + p[1];
    };

    return Cellular;
  }(Map);

  var FEATURES = {
    "room": Room,
    "corridor": Corridor
  };
  /**
   * Random dungeon generator using human-like digging patterns.
   * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
   * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
   */

  var Digger =
  /*#__PURE__*/
  function (_Dungeon2) {
    _inheritsLoose(Digger, _Dungeon2);

    function Digger(width, height, options) {
      var _this15;

      if (options === void 0) {
        options = {};
      }

      _this15 = _Dungeon2.call(this, width, height) || this;
      _this15._options = Object.assign({
        roomWidth: [3, 9],
        roomHeight: [3, 5],
        corridorLength: [3, 10],
        dugPercentage: 0.2,
        timeLimit: 1000
        /* we stop after this much time has passed (msec) */

      }, options);
      _this15._features = {
        "room": 4,
        "corridor": 4
      };
      _this15._map = [];
      _this15._featureAttempts = 20;
      /* how many times do we try to create a feature on a suitable wall */

      _this15._walls = {};
      /* these are available for digging */

      _this15._dug = 0;
      _this15._digCallback = _this15._digCallback.bind(_assertThisInitialized(_assertThisInitialized(_this15)));
      _this15._canBeDugCallback = _this15._canBeDugCallback.bind(_assertThisInitialized(_assertThisInitialized(_this15)));
      _this15._isWallCallback = _this15._isWallCallback.bind(_assertThisInitialized(_assertThisInitialized(_this15)));
      _this15._priorityWallCallback = _this15._priorityWallCallback.bind(_assertThisInitialized(_assertThisInitialized(_this15)));
      return _this15;
    }

    var _proto28 = Digger.prototype;

    _proto28.create = function create(callback) {
      this._rooms = [];
      this._corridors = [];
      this._map = this._fillMap(1);
      this._walls = {};
      this._dug = 0;
      var area = (this._width - 2) * (this._height - 2);

      this._firstRoom();

      var t1 = Date.now();
      var priorityWalls;

      do {
        priorityWalls = 0;
        var t2 = Date.now();

        if (t2 - t1 > this._options.timeLimit) {
          break;
        }
        /* find a good wall */


        var wall = this._findWall();

        if (!wall) {
          break;
        }
        /* no more walls */


        var parts = wall.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);

        var dir = this._getDiggingDirection(x, y);

        if (!dir) {
          continue;
        }
        /* this wall is not suitable */
        //		console.log("wall", x, y);

        /* try adding a feature */


        var featureAttempts = 0;

        do {
          featureAttempts++;

          if (this._tryFeature(x, y, dir[0], dir[1])) {
            /* feature added */
            //if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
            this._removeSurroundingWalls(x, y);

            this._removeSurroundingWalls(x - dir[0], y - dir[1]);

            break;
          }
        } while (featureAttempts < this._featureAttempts);

        for (var id in this._walls) {
          if (this._walls[id] > 1) {
            priorityWalls++;
          }
        }
      } while (this._dug / area < this._options.dugPercentage || priorityWalls);
      /* fixme number of priority walls */


      this._addDoors();

      if (callback) {
        for (var i = 0; i < this._width; i++) {
          for (var j = 0; j < this._height; j++) {
            callback(i, j, this._map[i][j]);
          }
        }
      }

      this._walls = {};
      this._map = [];
      return this;
    };

    _proto28._digCallback = function _digCallback(x, y, value) {
      if (value == 0 || value == 2) {
        /* empty */
        this._map[x][y] = 0;
        this._dug++;
      } else {
        /* wall */
        this._walls[x + "," + y] = 1;
      }
    };

    _proto28._isWallCallback = function _isWallCallback(x, y) {
      if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
        return false;
      }

      return this._map[x][y] == 1;
    };

    _proto28._canBeDugCallback = function _canBeDugCallback(x, y) {
      if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
        return false;
      }

      return this._map[x][y] == 1;
    };

    _proto28._priorityWallCallback = function _priorityWallCallback(x, y) {
      this._walls[x + "," + y] = 2;
    };

    _proto28._firstRoom = function _firstRoom() {
      var cx = Math.floor(this._width / 2);
      var cy = Math.floor(this._height / 2);
      var room = Room.createRandomCenter(cx, cy, this._options);

      this._rooms.push(room);

      room.create(this._digCallback);
    };
    /**
     * Get a suitable wall
     */


    _proto28._findWall = function _findWall() {
      var prio1 = [];
      var prio2 = [];

      for (var _id2 in this._walls) {
        var prio = this._walls[_id2];

        if (prio == 2) {
          prio2.push(_id2);
        } else {
          prio1.push(_id2);
        }
      }

      var arr = prio2.length ? prio2 : prio1;

      if (!arr.length) {
        return null;
      }
      /* no walls :/ */


      var id = RNG$1.getItem(arr.sort()); // sort to make the order deterministic

      delete this._walls[id];
      return id;
    };
    /**
     * Tries adding a feature
     * @returns {bool} was this a successful try?
     */


    _proto28._tryFeature = function _tryFeature(x, y, dx, dy) {
      var featureName = RNG$1.getWeightedValue(this._features);
      var ctor = FEATURES[featureName];
      var feature = ctor.createRandomAt(x, y, dx, dy, this._options);

      if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
        //		console.log("not valid");
        //		feature.debug();
        return false;
      }

      feature.create(this._digCallback); //	feature.debug();

      if (feature instanceof Room) {
        this._rooms.push(feature);
      }

      if (feature instanceof Corridor) {
        feature.createPriorityWalls(this._priorityWallCallback);

        this._corridors.push(feature);
      }

      return true;
    };

    _proto28._removeSurroundingWalls = function _removeSurroundingWalls(cx, cy) {
      var deltas = DIRS[4];

      for (var i = 0; i < deltas.length; i++) {
        var delta = deltas[i];
        var x = cx + delta[0];
        var y = cy + delta[1];
        delete this._walls[x + "," + y];
        x = cx + 2 * delta[0];
        y = cy + 2 * delta[1];
        delete this._walls[x + "," + y];
      }
    };
    /**
     * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
     */


    _proto28._getDiggingDirection = function _getDiggingDirection(cx, cy) {
      if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
        return null;
      }

      var result = null;
      var deltas = DIRS[4];

      for (var i = 0; i < deltas.length; i++) {
        var delta = deltas[i];
        var x = cx + delta[0];
        var y = cy + delta[1];

        if (!this._map[x][y]) {
          /* there already is another empty neighbor! */
          if (result) {
            return null;
          }

          result = delta;
        }
      }
      /* no empty neighbor */


      if (!result) {
        return null;
      }

      return [-result[0], -result[1]];
    };
    /**
     * Find empty spaces surrounding rooms, and apply doors.
     */


    _proto28._addDoors = function _addDoors() {
      var data = this._map;

      function isWallCallback(x, y) {
        return data[x][y] == 1;
      }

      for (var i = 0; i < this._rooms.length; i++) {
        var room = this._rooms[i];
        room.clearDoors();
        room.addDoors(isWallCallback);
      }
    };

    return Digger;
  }(Dungeon);
  /**
   * Join lists with "i" and "i+1"
   */


  function addToList(i, L, R) {
    R[L[i + 1]] = R[i];
    L[R[i]] = L[i + 1];
    R[i] = i + 1;
    L[i + 1] = i;
  }
  /**
   * Remove "i" from its list
   */


  function removeFromList(i, L, R) {
    R[L[i]] = R[i];
    L[R[i]] = L[i];
    R[i] = i;
    L[i] = i;
  }
  /**
   * Maze generator - Eller's algorithm
   * See http://homepages.cwi.nl/~tromp/maze.html for explanation
   */


  var EllerMaze =
  /*#__PURE__*/
  function (_Map4) {
    _inheritsLoose(EllerMaze, _Map4);

    function EllerMaze() {
      return _Map4.apply(this, arguments) || this;
    }

    var _proto29 = EllerMaze.prototype;

    _proto29.create = function create(callback) {
      var map = this._fillMap(1);

      var w = Math.ceil((this._width - 2) / 2);
      var rand = 9 / 24;
      var L = [];
      var R = [];

      for (var i = 0; i < w; i++) {
        L.push(i);
        R.push(i);
      }

      L.push(w - 1);
      /* fake stop-block at the right side */

      var j;

      for (j = 1; j + 3 < this._height; j += 2) {
        /* one row */
        for (var _i5 = 0; _i5 < w; _i5++) {
          /* cell coords (will be always empty) */
          var x = 2 * _i5 + 1;
          var y = j;
          map[x][y] = 0;
          /* right connection */

          if (_i5 != L[_i5 + 1] && RNG$1.getUniform() > rand) {
            addToList(_i5, L, R);
            map[x + 1][y] = 0;
          }
          /* bottom connection */


          if (_i5 != L[_i5] && RNG$1.getUniform() > rand) {
            /* remove connection */
            removeFromList(_i5, L, R);
          } else {
            /* create connection */
            map[x][y + 1] = 0;
          }
        }
      }
      /* last row */


      for (var _i6 = 0; _i6 < w; _i6++) {
        /* cell coords (will be always empty) */
        var _x2 = 2 * _i6 + 1;

        var _y2 = j;
        map[_x2][_y2] = 0;
        /* right connection */

        if (_i6 != L[_i6 + 1] && (_i6 == L[_i6] || RNG$1.getUniform() > rand)) {
          /* dig right also if the cell is separated, so it gets connected to the rest of maze */
          addToList(_i6, L, R);
          map[_x2 + 1][_y2] = 0;
        }

        removeFromList(_i6, L, R);
      }

      for (var _i7 = 0; _i7 < this._width; _i7++) {
        for (var _j = 0; _j < this._height; _j++) {
          callback(_i7, _j, map[_i7][_j]);
        }
      }

      return this;
    };

    return EllerMaze;
  }(Map);
  /**
   * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
   * @augments ROT.Map
   */


  var DividedMaze =
  /*#__PURE__*/
  function (_Map5) {
    _inheritsLoose(DividedMaze, _Map5);

    function DividedMaze() {
      var _this16;

      _this16 = _Map5.apply(this, arguments) || this;
      _this16._stack = [];
      _this16._map = [];
      return _this16;
    }

    var _proto30 = DividedMaze.prototype;

    _proto30.create = function create(callback) {
      var w = this._width;
      var h = this._height;
      this._map = [];

      for (var i = 0; i < w; i++) {
        this._map.push([]);

        for (var j = 0; j < h; j++) {
          var border = i == 0 || j == 0 || i + 1 == w || j + 1 == h;

          this._map[i].push(border ? 1 : 0);
        }
      }

      this._stack = [[1, 1, w - 2, h - 2]];

      this._process();

      for (var _i8 = 0; _i8 < w; _i8++) {
        for (var _j2 = 0; _j2 < h; _j2++) {
          callback(_i8, _j2, this._map[_i8][_j2]);
        }
      }

      this._map = [];
      return this;
    };

    _proto30._process = function _process() {
      while (this._stack.length) {
        var room = this._stack.shift();
        /* [left, top, right, bottom] */


        this._partitionRoom(room);
      }
    };

    _proto30._partitionRoom = function _partitionRoom(room) {
      var availX = [];
      var availY = [];

      for (var i = room[0] + 1; i < room[2]; i++) {
        var top = this._map[i][room[1] - 1];
        var bottom = this._map[i][room[3] + 1];

        if (top && bottom && !(i % 2)) {
          availX.push(i);
        }
      }

      for (var j = room[1] + 1; j < room[3]; j++) {
        var left = this._map[room[0] - 1][j];
        var right = this._map[room[2] + 1][j];

        if (left && right && !(j % 2)) {
          availY.push(j);
        }
      }

      if (!availX.length || !availY.length) {
        return;
      }

      var x = RNG$1.getItem(availX);
      var y = RNG$1.getItem(availY);
      this._map[x][y] = 1;
      var walls = [];
      var w = [];
      walls.push(w);
      /* left part */

      for (var _i9 = room[0]; _i9 < x; _i9++) {
        this._map[_i9][y] = 1;
        if (_i9 % 2) w.push([_i9, y]);
      }

      w = [];
      walls.push(w);
      /* right part */

      for (var _i10 = x + 1; _i10 <= room[2]; _i10++) {
        this._map[_i10][y] = 1;
        if (_i10 % 2) w.push([_i10, y]);
      }

      w = [];
      walls.push(w);
      /* top part */

      for (var _j3 = room[1]; _j3 < y; _j3++) {
        this._map[x][_j3] = 1;
        if (_j3 % 2) w.push([x, _j3]);
      }

      w = [];
      walls.push(w);
      /* bottom part */

      for (var _j4 = y + 1; _j4 <= room[3]; _j4++) {
        this._map[x][_j4] = 1;
        if (_j4 % 2) w.push([x, _j4]);
      }

      var solid = RNG$1.getItem(walls);

      for (var _i11 = 0; _i11 < walls.length; _i11++) {
        var _w = walls[_i11];

        if (_w == solid) {
          continue;
        }

        var hole = RNG$1.getItem(_w);
        this._map[hole[0]][hole[1]] = 0;
      }

      this._stack.push([room[0], room[1], x - 1, y - 1]);
      /* left top */


      this._stack.push([x + 1, room[1], room[2], y - 1]);
      /* right top */


      this._stack.push([room[0], y + 1, x - 1, room[3]]);
      /* left bottom */


      this._stack.push([x + 1, y + 1, room[2], room[3]]);
      /* right bottom */

    };

    return DividedMaze;
  }(Map);
  /**
   * Icey's Maze generator
   * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
   */


  var IceyMaze =
  /*#__PURE__*/
  function (_Map6) {
    _inheritsLoose(IceyMaze, _Map6);

    function IceyMaze(width, height, regularity) {
      var _this17;

      if (regularity === void 0) {
        regularity = 0;
      }

      _this17 = _Map6.call(this, width, height) || this;
      _this17._regularity = regularity;
      _this17._map = [];
      return _this17;
    }

    var _proto31 = IceyMaze.prototype;

    _proto31.create = function create(callback) {
      var width = this._width;
      var height = this._height;

      var map = this._fillMap(1);

      width -= width % 2 ? 1 : 2;
      height -= height % 2 ? 1 : 2;
      var cx = 0;
      var cy = 0;
      var nx = 0;
      var ny = 0;
      var done = 0;
      var blocked = false;
      var dirs = [[0, 0], [0, 0], [0, 0], [0, 0]];

      do {
        cx = 1 + 2 * Math.floor(RNG$1.getUniform() * (width - 1) / 2);
        cy = 1 + 2 * Math.floor(RNG$1.getUniform() * (height - 1) / 2);

        if (!done) {
          map[cx][cy] = 0;
        }

        if (!map[cx][cy]) {
          this._randomize(dirs);

          do {
            if (Math.floor(RNG$1.getUniform() * (this._regularity + 1)) == 0) {
              this._randomize(dirs);
            }

            blocked = true;

            for (var i = 0; i < 4; i++) {
              nx = cx + dirs[i][0] * 2;
              ny = cy + dirs[i][1] * 2;

              if (this._isFree(map, nx, ny, width, height)) {
                map[nx][ny] = 0;
                map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
                cx = nx;
                cy = ny;
                blocked = false;
                done++;
                break;
              }
            }
          } while (!blocked);
        }
      } while (done + 1 < width * height / 4);

      for (var _i12 = 0; _i12 < this._width; _i12++) {
        for (var j = 0; j < this._height; j++) {
          callback(_i12, j, map[_i12][j]);
        }
      }

      this._map = [];
      return this;
    };

    _proto31._randomize = function _randomize(dirs) {
      for (var i = 0; i < 4; i++) {
        dirs[i][0] = 0;
        dirs[i][1] = 0;
      }

      switch (Math.floor(RNG$1.getUniform() * 4)) {
        case 0:
          dirs[0][0] = -1;
          dirs[1][0] = 1;
          dirs[2][1] = -1;
          dirs[3][1] = 1;
          break;

        case 1:
          dirs[3][0] = -1;
          dirs[2][0] = 1;
          dirs[1][1] = -1;
          dirs[0][1] = 1;
          break;

        case 2:
          dirs[2][0] = -1;
          dirs[3][0] = 1;
          dirs[0][1] = -1;
          dirs[1][1] = 1;
          break;

        case 3:
          dirs[1][0] = -1;
          dirs[0][0] = 1;
          dirs[3][1] = -1;
          dirs[2][1] = 1;
          break;
      }
    };

    _proto31._isFree = function _isFree(map, x, y, width, height) {
      if (x < 1 || y < 1 || x >= width || y >= height) {
        return false;
      }

      return map[x][y];
    };

    return IceyMaze;
  }(Map);
  /**
   * Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
   * @author hyakugei
   */


  var Rogue =
  /*#__PURE__*/
  function (_Map7) {
    _inheritsLoose(Rogue, _Map7);

    function Rogue(width, height, options) {
      var _this18;

      _this18 = _Map7.call(this, width, height) || this;
      _this18.map = [];
      _this18.rooms = [];
      _this18.connectedCells = [];
      options = Object.assign({
        cellWidth: 3,
        cellHeight: 3 //     ie. as an array with min-max values for each direction....

      }, options);
      /*
      Set the room sizes according to the over-all width of the map,
      and the cell sizes.
      */

      if (!options.hasOwnProperty("roomWidth")) {
        options["roomWidth"] = _this18._calculateRoomSize(_this18._width, options["cellWidth"]);
      }

      if (!options.hasOwnProperty("roomHeight")) {
        options["roomHeight"] = _this18._calculateRoomSize(_this18._height, options["cellHeight"]);
      }

      _this18._options = options;
      return _this18;
    }

    var _proto32 = Rogue.prototype;

    _proto32.create = function create(callback) {
      this.map = this._fillMap(1);
      this.rooms = [];
      this.connectedCells = [];

      this._initRooms();

      this._connectRooms();

      this._connectUnconnectedRooms();

      this._createRandomRoomConnections();

      this._createRooms();

      this._createCorridors();

      if (callback) {
        for (var i = 0; i < this._width; i++) {
          for (var j = 0; j < this._height; j++) {
            callback(i, j, this.map[i][j]);
          }
        }
      }

      return this;
    };

    _proto32._calculateRoomSize = function _calculateRoomSize(size, cell) {
      var max = Math.floor(size / cell * 0.8);
      var min = Math.floor(size / cell * 0.25);

      if (min < 2) {
        min = 2;
      }

      if (max < 2) {
        max = 2;
      }

      return [min, max];
    };

    _proto32._initRooms = function _initRooms() {
      // create rooms array. This is the "grid" list from the algo.
      for (var i = 0; i < this._options.cellWidth; i++) {
        this.rooms.push([]);

        for (var j = 0; j < this._options.cellHeight; j++) {
          this.rooms[i].push({
            "x": 0,
            "y": 0,
            "width": 0,
            "height": 0,
            "connections": [],
            "cellx": i,
            "celly": j
          });
        }
      }
    };

    _proto32._connectRooms = function _connectRooms() {
      //pick random starting grid
      var cgx = RNG$1.getUniformInt(0, this._options.cellWidth - 1);
      var cgy = RNG$1.getUniformInt(0, this._options.cellHeight - 1);
      var idx;
      var ncgx;
      var ncgy;
      var found = false;
      var room;
      var otherRoom;
      var dirToCheck; // find  unconnected neighbour cells

      do {
        //dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
        dirToCheck = [0, 2, 4, 6];
        dirToCheck = RNG$1.shuffle(dirToCheck);

        do {
          found = false;
          idx = dirToCheck.pop();
          ncgx = cgx + DIRS[8][idx][0];
          ncgy = cgy + DIRS[8][idx][1];

          if (ncgx < 0 || ncgx >= this._options.cellWidth) {
            continue;
          }

          if (ncgy < 0 || ncgy >= this._options.cellHeight) {
            continue;
          }

          room = this.rooms[cgx][cgy];

          if (room["connections"].length > 0) {
            // as long as this room doesn't already coonect to me, we are ok with it.
            if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
              break;
            }
          }

          otherRoom = this.rooms[ncgx][ncgy];

          if (otherRoom["connections"].length == 0) {
            otherRoom["connections"].push([cgx, cgy]);
            this.connectedCells.push([ncgx, ncgy]);
            cgx = ncgx;
            cgy = ncgy;
            found = true;
          }
        } while (dirToCheck.length > 0 && found == false);
      } while (dirToCheck.length > 0);
    };

    _proto32._connectUnconnectedRooms = function _connectUnconnectedRooms() {
      //While there are unconnected rooms, try to connect them to a random connected neighbor
      //(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
      var cw = this._options.cellWidth;
      var ch = this._options.cellHeight;
      this.connectedCells = RNG$1.shuffle(this.connectedCells);
      var room;
      var otherRoom;
      var validRoom;

      for (var i = 0; i < this._options.cellWidth; i++) {
        for (var j = 0; j < this._options.cellHeight; j++) {
          room = this.rooms[i][j];

          if (room["connections"].length == 0) {
            var directions = [0, 2, 4, 6];
            directions = RNG$1.shuffle(directions);
            validRoom = false;

            do {
              var dirIdx = directions.pop();
              var newI = i + DIRS[8][dirIdx][0];
              var newJ = j + DIRS[8][dirIdx][1];

              if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
                continue;
              }

              otherRoom = this.rooms[newI][newJ];
              validRoom = true;

              if (otherRoom["connections"].length == 0) {
                break;
              }

              for (var k = 0; k < otherRoom["connections"].length; k++) {
                if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
                  validRoom = false;
                  break;
                }
              }

              if (validRoom) {
                break;
              }
            } while (directions.length);

            if (validRoom) {
              room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
            } else {
              console.log("-- Unable to connect room.");
            }
          }
        }
      }
    };

    _proto32._createRandomRoomConnections = function _createRandomRoomConnections() {// Empty for now.
    };

    _proto32._createRooms = function _createRooms() {
      var w = this._width;
      var h = this._height;
      var cw = this._options.cellWidth;
      var ch = this._options.cellHeight;
      var cwp = Math.floor(this._width / cw);
      var chp = Math.floor(this._height / ch);
      var roomw;
      var roomh;
      var roomWidth = this._options["roomWidth"];
      var roomHeight = this._options["roomHeight"];
      var sx;
      var sy;
      var otherRoom;

      for (var i = 0; i < cw; i++) {
        for (var j = 0; j < ch; j++) {
          sx = cwp * i;
          sy = chp * j;

          if (sx == 0) {
            sx = 1;
          }

          if (sy == 0) {
            sy = 1;
          }

          roomw = RNG$1.getUniformInt(roomWidth[0], roomWidth[1]);
          roomh = RNG$1.getUniformInt(roomHeight[0], roomHeight[1]);

          if (j > 0) {
            otherRoom = this.rooms[i][j - 1];

            while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
              sy++;
            }
          }

          if (i > 0) {
            otherRoom = this.rooms[i - 1][j];

            while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
              sx++;
            }
          }

          var sxOffset = Math.round(RNG$1.getUniformInt(0, cwp - roomw) / 2);
          var syOffset = Math.round(RNG$1.getUniformInt(0, chp - roomh) / 2);

          while (sx + sxOffset + roomw >= w) {
            if (sxOffset) {
              sxOffset--;
            } else {
              roomw--;
            }
          }

          while (sy + syOffset + roomh >= h) {
            if (syOffset) {
              syOffset--;
            } else {
              roomh--;
            }
          }

          sx = sx + sxOffset;
          sy = sy + syOffset;
          this.rooms[i][j]["x"] = sx;
          this.rooms[i][j]["y"] = sy;
          this.rooms[i][j]["width"] = roomw;
          this.rooms[i][j]["height"] = roomh;

          for (var ii = sx; ii < sx + roomw; ii++) {
            for (var jj = sy; jj < sy + roomh; jj++) {
              this.map[ii][jj] = 0;
            }
          }
        }
      }
    };

    _proto32._getWallPosition = function _getWallPosition(aRoom, aDirection) {
      var rx;
      var ry;
      var door;

      if (aDirection == 1 || aDirection == 3) {
        rx = RNG$1.getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);

        if (aDirection == 1) {
          ry = aRoom["y"] - 2;
          door = ry + 1;
        } else {
          ry = aRoom["y"] + aRoom["height"] + 1;
          door = ry - 1;
        }

        this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
      } else {
        ry = RNG$1.getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);

        if (aDirection == 2) {
          rx = aRoom["x"] + aRoom["width"] + 1;
          door = rx - 1;
        } else {
          rx = aRoom["x"] - 2;
          door = rx + 1;
        }

        this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
      }

      return [rx, ry];
    };

    _proto32._drawCorridor = function _drawCorridor(startPosition, endPosition) {
      var xOffset = endPosition[0] - startPosition[0];
      var yOffset = endPosition[1] - startPosition[1];
      var xpos = startPosition[0];
      var ypos = startPosition[1];
      var tempDist;
      var xDir;
      var yDir;
      var move; // 2 element array, element 0 is the direction, element 1 is the total value to move.

      var moves = []; // a list of 2 element arrays

      var xAbs = Math.abs(xOffset);
      var yAbs = Math.abs(yOffset);
      var percent = RNG$1.getUniform(); // used to split the move at different places along the long axis

      var firstHalf = percent;
      var secondHalf = 1 - percent;
      xDir = xOffset > 0 ? 2 : 6;
      yDir = yOffset > 0 ? 4 : 0;

      if (xAbs < yAbs) {
        // move firstHalf of the y offset
        tempDist = Math.ceil(yAbs * firstHalf);
        moves.push([yDir, tempDist]); // move all the x offset

        moves.push([xDir, xAbs]); // move sendHalf of the  y offset

        tempDist = Math.floor(yAbs * secondHalf);
        moves.push([yDir, tempDist]);
      } else {
        //  move firstHalf of the x offset
        tempDist = Math.ceil(xAbs * firstHalf);
        moves.push([xDir, tempDist]); // move all the y offset

        moves.push([yDir, yAbs]); // move secondHalf of the x offset.

        tempDist = Math.floor(xAbs * secondHalf);
        moves.push([xDir, tempDist]);
      }

      this.map[xpos][ypos] = 0;

      while (moves.length > 0) {
        move = moves.pop();

        while (move[1] > 0) {
          xpos += DIRS[8][move[0]][0];
          ypos += DIRS[8][move[0]][1];
          this.map[xpos][ypos] = 0;
          move[1] = move[1] - 1;
        }
      }
    };

    _proto32._createCorridors = function _createCorridors() {
      // Draw Corridors between connected rooms
      var cw = this._options.cellWidth;
      var ch = this._options.cellHeight;
      var room;
      var connection;
      var otherRoom;
      var wall;
      var otherWall;

      for (var i = 0; i < cw; i++) {
        for (var j = 0; j < ch; j++) {
          room = this.rooms[i][j];

          for (var k = 0; k < room["connections"].length; k++) {
            connection = room["connections"][k];
            otherRoom = this.rooms[connection[0]][connection[1]]; // figure out what wall our corridor will start one.
            // figure out what wall our corridor will end on.

            if (otherRoom["cellx"] > room["cellx"]) {
              wall = 2;
              otherWall = 4;
            } else if (otherRoom["cellx"] < room["cellx"]) {
              wall = 4;
              otherWall = 2;
            } else if (otherRoom["celly"] > room["celly"]) {
              wall = 3;
              otherWall = 1;
            } else {
              wall = 1;
              otherWall = 3;
            }

            this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
          }
        }
      }
    };

    return Rogue;
  }(Map);

  var index$2 = {
    Arena: Arena,
    Uniform: Uniform,
    Cellular: Cellular,
    Digger: Digger,
    EllerMaze: EllerMaze,
    DividedMaze: DividedMaze,
    IceyMaze: IceyMaze,
    Rogue: Rogue
  };
  /**
   * Base noise generator
   */

  var Noise = function Noise() {};

  var F2 = 0.5 * (Math.sqrt(3) - 1);
  var G2 = (3 - Math.sqrt(3)) / 6;
  /**
   * A simple 2d implementation of simplex noise by Ondrej Zara
   *
   * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
   * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
   * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
   * Better rank ordering method by Stefan Gustavson in 2012.
   */

  var Simplex =
  /*#__PURE__*/
  function (_Noise) {
    _inheritsLoose(Simplex, _Noise);

    /**
     * @param gradients Random gradients
     */
    function Simplex(gradients) {
      var _this19;

      if (gradients === void 0) {
        gradients = 256;
      }

      _this19 = _Noise.call(this) || this;
      _this19._gradients = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
      var permutations = [];

      for (var i = 0; i < gradients; i++) {
        permutations.push(i);
      }

      permutations = RNG$1.shuffle(permutations);
      _this19._perms = [];
      _this19._indexes = [];

      for (var _i13 = 0; _i13 < 2 * gradients; _i13++) {
        _this19._perms.push(permutations[_i13 % gradients]);

        _this19._indexes.push(_this19._perms[_i13] % _this19._gradients.length);
      }

      return _this19;
    }

    var _proto33 = Simplex.prototype;

    _proto33.get = function get(xin, yin) {
      var perms = this._perms;
      var indexes = this._indexes;
      var count = perms.length / 2;
      var n0 = 0,
          n1 = 0,
          n2 = 0,
          gi; // Noise contributions from the three corners
      // Skew the input space to determine which simplex cell we're in

      var s = (xin + yin) * F2; // Hairy factor for 2D

      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var t = (i + j) * G2;
      var X0 = i - t; // Unskew the cell origin back to (x,y) space

      var Y0 = j - t;
      var x0 = xin - X0; // The x,y distances from the cell origin

      var y0 = yin - Y0; // For the 2D case, the simplex shape is an equilateral triangle.
      // Determine which simplex we are in.

      var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords

      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } else {
        // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        i1 = 0;
        j1 = 1;
      } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
      // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
      // c = (3-sqrt(3))/6


      var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords

      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords

      var y2 = y0 - 1 + 2 * G2; // Work out the hashed gradient indices of the three simplex corners

      var ii = mod(i, count);
      var jj = mod(j, count); // Calculate the contribution from the three corners

      var t0 = 0.5 - x0 * x0 - y0 * y0;

      if (t0 >= 0) {
        t0 *= t0;
        gi = indexes[ii + perms[jj]];
        var grad = this._gradients[gi];
        n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
      }

      var t1 = 0.5 - x1 * x1 - y1 * y1;

      if (t1 >= 0) {
        t1 *= t1;
        gi = indexes[ii + i1 + perms[jj + j1]];
        var _grad = this._gradients[gi];
        n1 = t1 * t1 * (_grad[0] * x1 + _grad[1] * y1);
      }

      var t2 = 0.5 - x2 * x2 - y2 * y2;

      if (t2 >= 0) {
        t2 *= t2;
        gi = indexes[ii + 1 + perms[jj + 1]];
        var _grad2 = this._gradients[gi];
        n2 = t2 * t2 * (_grad2[0] * x2 + _grad2[1] * y2);
      } // Add contributions from each corner to get the final noise value.
      // The result is scaled to return values in the interval [-1,1].


      return 70 * (n0 + n1 + n2);
    };

    return Simplex;
  }(Noise);

  var index$3 = {
    Simplex: Simplex
  };
  /**
   * @class Abstract pathfinder
   * @param {int} toX Target X coord
   * @param {int} toY Target Y coord
   * @param {function} passableCallback Callback to determine map passability
   * @param {object} [options]
   * @param {int} [options.topology=8]
   */

  var Path =
  /*#__PURE__*/
  function () {
    function Path(toX, toY, passableCallback, options) {
      if (options === void 0) {
        options = {};
      }

      this._toX = toX;
      this._toY = toY;
      this._passableCallback = passableCallback;
      this._options = Object.assign({
        topology: 8
      }, options);
      this._dirs = DIRS[this._options.topology];

      if (this._options.topology == 8) {
        /* reorder dirs for more aesthetic result (vertical/horizontal first) */
        this._dirs = [this._dirs[0], this._dirs[2], this._dirs[4], this._dirs[6], this._dirs[1], this._dirs[3], this._dirs[5], this._dirs[7]];
      }
    }

    var _proto34 = Path.prototype;

    _proto34._getNeighbors = function _getNeighbors(cx, cy) {
      var result = [];

      for (var i = 0; i < this._dirs.length; i++) {
        var dir = this._dirs[i];
        var x = cx + dir[0];
        var y = cy + dir[1];

        if (!this._passableCallback(x, y)) {
          continue;
        }

        result.push([x, y]);
      }

      return result;
    };

    return Path;
  }();
  /**
   * @class Simplified Dijkstra's algorithm: all edges have a value of 1
   * @augments ROT.Path
   * @see ROT.Path
   */


  var Dijkstra =
  /*#__PURE__*/
  function (_Path) {
    _inheritsLoose(Dijkstra, _Path);

    function Dijkstra(toX, toY, passableCallback, options) {
      var _this20;

      _this20 = _Path.call(this, toX, toY, passableCallback, options) || this;
      _this20._computed = {};
      _this20._todo = [];

      _this20._add(toX, toY, null);

      return _this20;
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */


    var _proto35 = Dijkstra.prototype;

    _proto35.compute = function compute(fromX, fromY, callback) {
      var key = fromX + "," + fromY;

      if (!(key in this._computed)) {
        this._compute(fromX, fromY);
      }

      if (!(key in this._computed)) {
        return;
      }

      var item = this._computed[key];

      while (item) {
        callback(item.x, item.y);
        item = item.prev;
      }
    };
    /**
     * Compute a non-cached value
     */


    _proto35._compute = function _compute(fromX, fromY) {
      while (this._todo.length) {
        var item = this._todo.shift();

        if (item.x == fromX && item.y == fromY) {
          return;
        }

        var neighbors = this._getNeighbors(item.x, item.y);

        for (var i = 0; i < neighbors.length; i++) {
          var neighbor = neighbors[i];
          var x = neighbor[0];
          var y = neighbor[1];
          var id = x + "," + y;

          if (id in this._computed) {
            continue;
          }
          /* already done */


          this._add(x, y, item);
        }
      }
    };

    _proto35._add = function _add(x, y, prev) {
      var obj = {
        x: x,
        y: y,
        prev: prev
      };
      this._computed[x + "," + y] = obj;

      this._todo.push(obj);
    };

    return Dijkstra;
  }(Path);
  /**
   * @class Simplified A* algorithm: all edges have a value of 1
   * @augments ROT.Path
   * @see ROT.Path
   */


  var AStar =
  /*#__PURE__*/
  function (_Path2) {
    _inheritsLoose(AStar, _Path2);

    function AStar(toX, toY, passableCallback, options) {
      var _this21;

      if (options === void 0) {
        options = {};
      }

      _this21 = _Path2.call(this, toX, toY, passableCallback, options) || this;
      _this21._todo = [];
      _this21._done = {};
      return _this21;
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */


    var _proto36 = AStar.prototype;

    _proto36.compute = function compute(fromX, fromY, callback) {
      this._todo = [];
      this._done = {};
      this._fromX = fromX;
      this._fromY = fromY;

      this._add(this._toX, this._toY, null);

      while (this._todo.length) {
        var _item = this._todo.shift();

        var id = _item.x + "," + _item.y;

        if (id in this._done) {
          continue;
        }

        this._done[id] = _item;

        if (_item.x == fromX && _item.y == fromY) {
          break;
        }

        var neighbors = this._getNeighbors(_item.x, _item.y);

        for (var i = 0; i < neighbors.length; i++) {
          var neighbor = neighbors[i];
          var x = neighbor[0];
          var y = neighbor[1];

          var _id3 = x + "," + y;

          if (_id3 in this._done) {
            continue;
          }

          this._add(x, y, _item);
        }
      }

      var item = this._done[fromX + "," + fromY];

      if (!item) {
        return;
      }

      while (item) {
        callback(item.x, item.y);
        item = item.prev;
      }
    };

    _proto36._add = function _add(x, y, prev) {
      var h = this._distance(x, y);

      var obj = {
        x: x,
        y: y,
        prev: prev,
        g: prev ? prev.g + 1 : 0,
        h: h
      };
      /* insert into priority queue */

      var f = obj.g + obj.h;

      for (var i = 0; i < this._todo.length; i++) {
        var item = this._todo[i];
        var itemF = item.g + item.h;

        if (f < itemF || f == itemF && h < item.h) {
          this._todo.splice(i, 0, obj);

          return;
        }
      }

      this._todo.push(obj);
    };

    _proto36._distance = function _distance(x, y) {
      switch (this._options.topology) {
        case 4:
          return Math.abs(x - this._fromX) + Math.abs(y - this._fromY);
          break;

        case 6:
          var dx = Math.abs(x - this._fromX);
          var dy = Math.abs(y - this._fromY);
          return dy + Math.max(0, (dx - dy) / 2);
          break;

        case 8:
          return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
          break;
      }
    };

    return AStar;
  }(Path);

  var index$4 = {
    Dijkstra: Dijkstra,
    AStar: AStar
  };
  /**
   * @class Asynchronous main loop
   * @param {ROT.Scheduler} scheduler
   */

  var Engine =
  /*#__PURE__*/
  function () {
    function Engine(scheduler) {
      this._scheduler = scheduler;
      this._lock = 1;
    }
    /**
     * Start the main loop. When this call returns, the loop is locked.
     */


    var _proto37 = Engine.prototype;

    _proto37.start = function start() {
      return this.unlock();
    };
    /**
     * Interrupt the engine by an asynchronous action
     */


    _proto37.lock = function lock() {
      this._lock++;
      return this;
    };
    /**
     * Resume execution (paused by a previous lock)
     */


    _proto37.unlock = function unlock() {
      if (!this._lock) {
        throw new Error("Cannot unlock unlocked engine");
      }

      this._lock--;

      while (!this._lock) {
        var actor = this._scheduler.next();

        if (!actor) {
          return this.lock();
        }
        /* no actors */


        var result = actor.act();

        if (result && result.then) {
          /* actor returned a "thenable", looks like a Promise */
          this.lock();
          result.then(this.unlock.bind(this));
        }
      }

      return this;
    };

    return Engine;
  }();
  /**
   * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
   */


  var Lighting =
  /*#__PURE__*/
  function () {
    function Lighting(reflectivityCallback, options) {
      if (options === void 0) {
        options = {};
      }

      this._reflectivityCallback = reflectivityCallback;
      this._options = {};
      options = Object.assign({
        passes: 1,
        emissionThreshold: 100,
        range: 10
      }, options);
      this._lights = {};
      this._reflectivityCache = {};
      this._fovCache = {};
      this.setOptions(options);
    }
    /**
     * Adjust options at runtime
     */


    var _proto38 = Lighting.prototype;

    _proto38.setOptions = function setOptions(options) {
      Object.assign(this._options, options);

      if (options && options.range) {
        this.reset();
      }

      return this;
    };
    /**
     * Set the used Field-Of-View algo
     */


    _proto38.setFOV = function setFOV(fov) {
      this._fov = fov;
      this._fovCache = {};
      return this;
    };
    /**
     * Set (or remove) a light source
     */


    _proto38.setLight = function setLight(x, y, color) {
      var key = x + "," + y;

      if (color) {
        this._lights[key] = typeof color == "string" ? fromString(color) : color;
      } else {
        delete this._lights[key];
      }

      return this;
    };
    /**
     * Remove all light sources
     */


    _proto38.clearLights = function clearLights() {
      this._lights = {};
    };
    /**
     * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
     */


    _proto38.reset = function reset() {
      this._reflectivityCache = {};
      this._fovCache = {};
      return this;
    };
    /**
     * Compute the lighting
     */


    _proto38.compute = function compute(lightingCallback) {
      var doneCells = {};
      var emittingCells = {};
      var litCells = {};

      for (var key in this._lights) {
        /* prepare emitters for first pass */
        var light = this._lights[key];
        emittingCells[key] = [0, 0, 0];
        add_(emittingCells[key], light);
      }

      for (var i = 0; i < this._options.passes; i++) {
        /* main loop */
        this._emitLight(emittingCells, litCells, doneCells);

        if (i + 1 == this._options.passes) {
          continue;
        }
        /* not for the last pass */


        emittingCells = this._computeEmitters(litCells, doneCells);
      }

      for (var litKey in litCells) {
        /* let the user know what and how is lit */
        var parts = litKey.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        lightingCallback(x, y, litCells[litKey]);
      }

      return this;
    };
    /**
     * Compute one iteration from all emitting cells
     * @param emittingCells These emit light
     * @param litCells Add projected light to these
     * @param doneCells These already emitted, forbid them from further calculations
     */


    _proto38._emitLight = function _emitLight(emittingCells, litCells, doneCells) {
      for (var key in emittingCells) {
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);

        this._emitLightFromCell(x, y, emittingCells[key], litCells);

        doneCells[key] = 1;
      }

      return this;
    };
    /**
     * Prepare a list of emitters for next pass
     */


    _proto38._computeEmitters = function _computeEmitters(litCells, doneCells) {
      var result = {};

      for (var key in litCells) {
        if (key in doneCells) {
          continue;
        }
        /* already emitted */


        var _color = litCells[key];
        var reflectivity = void 0;

        if (key in this._reflectivityCache) {
          reflectivity = this._reflectivityCache[key];
        } else {
          var parts = key.split(",");
          var x = parseInt(parts[0]);
          var y = parseInt(parts[1]);
          reflectivity = this._reflectivityCallback(x, y);
          this._reflectivityCache[key] = reflectivity;
        }

        if (reflectivity == 0) {
          continue;
        }
        /* will not reflect at all */

        /* compute emission color */


        var emission = [0, 0, 0];
        var intensity = 0;

        for (var i = 0; i < 3; i++) {
          var part = Math.round(_color[i] * reflectivity);
          emission[i] = part;
          intensity += part;
        }

        if (intensity > this._options.emissionThreshold) {
          result[key] = emission;
        }
      }

      return result;
    };
    /**
     * Compute one iteration from one cell
     */


    _proto38._emitLightFromCell = function _emitLightFromCell(x, y, color, litCells) {
      var key = x + "," + y;
      var fov;

      if (key in this._fovCache) {
        fov = this._fovCache[key];
      } else {
        fov = this._updateFOV(x, y);
      }

      for (var fovKey in fov) {
        var formFactor = fov[fovKey];
        var result = void 0;

        if (fovKey in litCells) {
          /* already lit */
          result = litCells[fovKey];
        } else {
          /* newly lit */
          result = [0, 0, 0];
          litCells[fovKey] = result;
        }

        for (var i = 0; i < 3; i++) {
          result[i] += Math.round(color[i] * formFactor);
        }
        /* add light color */

      }

      return this;
    };
    /**
     * Compute FOV ("form factor") for a potential light source at [x,y]
     */


    _proto38._updateFOV = function _updateFOV(x, y) {
      var key1 = x + "," + y;
      var cache = {};
      this._fovCache[key1] = cache;
      var range = this._options.range;

      function cb(x, y, r, vis) {
        var key2 = x + "," + y;
        var formFactor = vis * (1 - r / range);

        if (formFactor == 0) {
          return;
        }

        cache[key2] = formFactor;
      }

      this._fov.compute(x, y, range, cb.bind(this));

      return cache;
    };

    return Lighting;
  }();

  var Util = util;
  var Color = color;
  var Text = text;
  exports.Util = Util;
  exports.Color = Color;
  exports.Text = Text;
  exports.RNG = RNG$1;
  exports.Display = Display;
  exports.StringGenerator = StringGenerator;
  exports.EventQueue = EventQueue;
  exports.Scheduler = index;
  exports.FOV = index$1;
  exports.Map = index$2;
  exports.Noise = index$3;
  exports.Path = index$4;
  exports.Engine = Engine;
  exports.Lighting = Lighting;
  exports.DEFAULT_WIDTH = DEFAULT_WIDTH;
  exports.DEFAULT_HEIGHT = DEFAULT_HEIGHT;
  exports.DIRS = DIRS;
  exports.KEYS = KEYS;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});


}).call(this)}).call(this,require('_process'))
},{"_process":1}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const C_1 = require("./C");
const Enums_1 = require("./Enums");
const BorderTile_1 = require("./boardTiles/BorderTile");
const CavernGrassTile_1 = require("./boardTiles/CavernGrassTile");
const CoralTile_1 = require("./boardTiles/CoralTile");
const FloorTile_1 = require("./boardTiles/FloorTile");
const GlowingCrystalTile_1 = require("./boardTiles/GlowingCrystalTile");
const WallTile_1 = require("./boardTiles/WallTile");
const WaterTile_1 = require("./boardTiles/WaterTile");
const ActorController_1 = require("./controllers/ActorController");
const AudioController_1 = require("./controllers/AudioController");
const EffectsController_1 = require("./controllers/EffectsController");
const GraphController_1 = require("./controllers/GraphController");
const LightController_1 = require("./controllers/LightController");
const TileController_1 = require("./controllers/TileController");
const UIController_1 = require("./controllers/UIController");
const Cell_1 = require("./util/Cell");
class Board {
    constructor() {
        this.tiles = new TileController_1.default();
        this.actors = new ActorController_1.default();
        this.effects = new EffectsController_1.default();
        this.icons = new UIController_1.default();
        this.graph = new GraphController_1.default();
        this.lights = new LightController_1.default();
        this.sounds = new AudioController_1.default();
    }
    generate() {
        let cavernUserCallback = (x, y, value) => {
            let newTile;
            let newWaterTile;
            if (Cell_1.default.xyOnEdge(x, y)) {
                newTile = new BorderTile_1.BorderTile();
                newWaterTile = new BorderTile_1.BorderTile();
            }
            else if (value == 0) {
                newTile = new WallTile_1.WallTile();
                newWaterTile = new WallTile_1.WallTile();
            }
            else if (value == 1)
                if (rot_js_1.RNG.getUniform() < .025) {
                    newTile = new GlowingCrystalTile_1.GlowingCrystalTile();
                    newWaterTile = new WaterTile_1.WaterTile();
                }
                else {
                    newTile = new WaterTile_1.WaterTile();
                    if (rot_js_1.RNG.getUniform() < .02)
                        newWaterTile = new CoralTile_1.default();
                    else
                        newWaterTile = new WaterTile_1.WaterTile();
                }
            this.tiles.set(Cell_1.default.get(x, y, Enums_1.Layer.ABOVE), newTile);
            this.tiles.set(Cell_1.default.get(x, y, Enums_1.Layer.BELOW), newWaterTile);
        };
        let cavernUserCallback2 = (x, y, value) => {
            let newWaterTile;
            if (Cell_1.default.xyOnEdge(x, y)) {
                return;
            }
            else if (value == 0) {
                return;
            }
            else if (value == 1)
                if (rot_js_1.RNG.getUniform() < .001) {
                    newWaterTile = new GlowingCrystalTile_1.GlowingCrystalTile();
                }
                else {
                    if (rot_js_1.RNG.getUniform() < .02)
                        newWaterTile = new CoralTile_1.default();
                    else
                        newWaterTile = new WaterTile_1.WaterTile();
                }
            this.tiles.replace(Cell_1.default.get(x, y, Enums_1.Layer.BELOW), newWaterTile);
        };
        let cavernMap = new rot_js_1.Map.Cellular(C_1.default.BOARD_WIDTH, C_1.default.BOARD_HEIGHT);
        cavernMap.randomize(.4);
        for (var i = 0; i < 5; i++) {
            cavernMap.create();
        }
        cavernMap.create(cavernUserCallback);
        cavernMap = new rot_js_1.Map.Cellular(C_1.default.BOARD_WIDTH, C_1.default.BOARD_HEIGHT);
        cavernMap.randomize(.5);
        for (var i = 0; i < 3; i++) {
            cavernMap.create();
        }
        cavernMap.create(cavernUserCallback2);
        let structuredUserCallback = (x, y, value) => {
            let newTile;
            let cell = Cell_1.default.get(x, y, Enums_1.Layer.ABOVE);
            if (value == 0 && !cell.onEdge() && this.tiles.getElementViaCell(cell).name != "Glowing Crystal") {
                newTile = new FloorTile_1.FloorTile();
                this.tiles.replace(Cell_1.default.get(x, y, Enums_1.Layer.ABOVE), newTile);
            }
        };
        let structuredMap;
        if (rot_js_1.RNG.getUniform() < .5)
            structuredMap = new rot_js_1.Map.Uniform(C_1.default.BOARD_WIDTH, C_1.default.BOARD_HEIGHT, { roomWidth: [3, 7], roomHeight: [3, 7], roomDugPercentage: .1 });
        else
            structuredMap = new rot_js_1.Map.Digger(C_1.default.BOARD_WIDTH, C_1.default.BOARD_HEIGHT, { roomWidth: [3, 7], roomHeight: [3, 7], corridorLength: [1, 12] });
        structuredMap.create(structuredUserCallback);
        let vegetationUserCallback = (x, y, value) => {
            let newTile;
            if (value == 1 && this.tiles.getElementViaXYZ(x, y, Enums_1.Layer.ABOVE).name == "Floor") {
                newTile = new CavernGrassTile_1.CavernGrassTile();
                this.tiles.replace(Cell_1.default.get(x, y, Enums_1.Layer.ABOVE), newTile);
            }
        };
        let vegetationMap = new rot_js_1.Map.Cellular(C_1.default.BOARD_WIDTH, C_1.default.BOARD_HEIGHT);
        vegetationMap.randomize(.5);
        for (var i = 0; i < 3; i++) {
            vegetationMap.create();
        }
        vegetationMap.create(vegetationUserCallback);
    }
}
exports.default = Board;

},{"./C":16,"./Enums":17,"./boardTiles/BorderTile":34,"./boardTiles/CavernGrassTile":35,"./boardTiles/CoralTile":36,"./boardTiles/FloorTile":37,"./boardTiles/GlowingCrystalTile":38,"./boardTiles/WallTile":40,"./boardTiles/WaterTile":41,"./controllers/ActorController":44,"./controllers/AudioController":45,"./controllers/EffectsController":46,"./controllers/GraphController":47,"./controllers/LightController":48,"./controllers/TileController":49,"./controllers/UIController":50,"./util/Cell":64,"rot-js":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class C {
}
exports.default = C;
C.BOARD_WIDTH = 60;
C.BOARD_HEIGHT = 30;
C.BOARD_DEPTH = 2;
C.MAX_LOG_LENGTH = 50;
C.LOG_DISPLAY_WIDTH = C.BOARD_WIDTH;
C.LOG_DISPLAY_HEIGHT = 5;
C.LIGHT_DEFAULT_REFLECTIVITY = .3;
C.BOARD_DISPLAY_OPTIONS = {
    bg: "black",
    fg: "dimGrey",
    fontFamily: "monospace",
    width: C.BOARD_WIDTH,
    height: C.BOARD_HEIGHT,
    fontSize: 24,
};
C.LOG_DISPLAY_OPTIONS = {
    width: C.LOG_DISPLAY_WIDTH,
    height: C.LOG_DISPLAY_HEIGHT,
    fontSize: 24,
};

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraversibilityFlags = exports.Layer = exports.ActionState = exports.SwitchSetting = exports.DrawDataType = exports.TryMoveResult = exports.PathDir = exports.Dir = exports.InputState = void 0;
var InputState;
(function (InputState) {
    InputState[InputState["BOARD_CONTROL"] = 0] = "BOARD_CONTROL";
    InputState[InputState["EFFECT_LOOP"] = 1] = "EFFECT_LOOP";
    InputState[InputState["TARGETING"] = 2] = "TARGETING";
})(InputState = exports.InputState || (exports.InputState = {}));
var Dir;
(function (Dir) {
    Dir[Dir["N"] = 0] = "N";
    Dir[Dir["NE"] = 1] = "NE";
    Dir[Dir["E"] = 2] = "E";
    Dir[Dir["SE"] = 3] = "SE";
    Dir[Dir["S"] = 4] = "S";
    Dir[Dir["SW"] = 5] = "SW";
    Dir[Dir["W"] = 6] = "W";
    Dir[Dir["NW"] = 7] = "NW";
})(Dir = exports.Dir || (exports.Dir = {}));
var PathDir;
(function (PathDir) {
    PathDir[PathDir["STRAIGHT"] = 0] = "STRAIGHT";
    PathDir[PathDir["DIAGONAL"] = 1] = "DIAGONAL";
    PathDir[PathDir["VERTICAL"] = 2] = "VERTICAL";
})(PathDir = exports.PathDir || (exports.PathDir = {}));
var TryMoveResult;
(function (TryMoveResult) {
    TryMoveResult[TryMoveResult["SUCCESFUL"] = 0] = "SUCCESFUL";
    TryMoveResult[TryMoveResult["ENEMY"] = 1] = "ENEMY";
    TryMoveResult[TryMoveResult["FRIENDLY"] = 2] = "FRIENDLY";
    TryMoveResult[TryMoveResult["IMPASSABLE"] = 3] = "IMPASSABLE";
})(TryMoveResult = exports.TryMoveResult || (exports.TryMoveResult = {}));
var DrawDataType;
(function (DrawDataType) {
    DrawDataType[DrawDataType["GLYPH"] = 0] = "GLYPH";
    DrawDataType[DrawDataType["FOREGROUND_COLOR"] = 1] = "FOREGROUND_COLOR";
    DrawDataType[DrawDataType["BACKGROUND_COLOR"] = 2] = "BACKGROUND_COLOR";
})(DrawDataType = exports.DrawDataType || (exports.DrawDataType = {}));
var SwitchSetting;
(function (SwitchSetting) {
    SwitchSetting[SwitchSetting["ACTIVATE"] = 0] = "ACTIVATE";
    SwitchSetting[SwitchSetting["DEACTIVATE"] = 1] = "DEACTIVATE";
    SwitchSetting[SwitchSetting["TOGGLE"] = 2] = "TOGGLE";
})(SwitchSetting = exports.SwitchSetting || (exports.SwitchSetting = {}));
var ActionState;
(function (ActionState) {
    ActionState["PENDING"] = "pending";
    ActionState["PERFORMING"] = "performing";
    ActionState["SUCCESSFUL"] = "successful";
    ActionState["UNSUCCESSFUL"] = "unsuccessful";
    ActionState["START_EFFECT"] = "start effect";
})(ActionState = exports.ActionState || (exports.ActionState = {}));
var Layer;
(function (Layer) {
    Layer[Layer["ABOVE"] = 0] = "ABOVE";
    Layer[Layer["BELOW"] = 1] = "BELOW";
})(Layer = exports.Layer || (exports.Layer = {}));
var TraversibilityFlags;
(function (TraversibilityFlags) {
    TraversibilityFlags[TraversibilityFlags["CLEAR"] = 0] = "CLEAR";
    TraversibilityFlags[TraversibilityFlags["WATER"] = 1] = "WATER";
    TraversibilityFlags[TraversibilityFlags["SOLID_ROCK"] = 2] = "SOLID_ROCK";
    TraversibilityFlags[TraversibilityFlags["VEGETATION"] = 4] = "VEGETATION";
})(TraversibilityFlags = exports.TraversibilityFlags || (exports.TraversibilityFlags = {}));

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pizzicato = require("pizzicato");
const rot_js_1 = require("rot-js");
const Board_1 = require("./Board");
const Enums_1 = require("./Enums");
const AnglerFish_1 = require("./actors/AnglerFish");
const Goomba_1 = require("./actors/Goomba");
const Player_1 = require("./actors/Player");
const BoardDisplay_1 = require("./displays/BoardDisplay");
const LogDisplay_1 = require("./displays/LogDisplay");
const Input_1 = require("./input/Input");
const Log_1 = require("./logging/Log");
class G {
    static init() {
        rot_js_1.RNG.setSeed(-123);
        document.body.append(G._logDisplay.getContainer());
        document.body.append(G._boardDisplay.getContainer());
        G.log = new Log_1.default(G._logDisplay);
        G._boardDisplay.init();
        G.board = new Board_1.default();
        G.board.generate();
        G.player = new Player_1.default();
        for (let tileAndCell of G.board.tiles.iterateElements()) {
            if (tileAndCell[0].name === "Floor") {
                G.board.actors.set(tileAndCell[1], G.player);
                break;
            }
        }
        for (let tileAndCell of G.board.tiles.iterateElements()) {
            if (tileAndCell[0].passable && tileAndCell[0].layer == 0 && !tileAndCell[0].occupant() && rot_js_1.RNG.getUniform() < .025) {
                let g = new Goomba_1.default();
                G.board.actors.set(tileAndCell[1], g);
            }
        }
        for (let tileAndCell of G.board.tiles.iterateElements()) {
            if (tileAndCell[0].passable && tileAndCell[0].position.layer == 1 && !tileAndCell[0].occupant() && rot_js_1.RNG.getUniform() < .01) {
                let f = new AnglerFish_1.default();
                G.board.actors.set(tileAndCell[1], f);
            }
        }
        G.board.lights.update();
        G.player.computeFov();
        G.drawBoard();
        Input_1.default.init(G._logDisplay, G._boardDisplay);
        window.onscroll = G.recalculateCanvasRects;
        window.onresize = G.recalculateCanvasRects;
        window.onclick = G.resumeSoundContext;
        window.onblur = G.stopSoundContext;
        G.log.write("Welcome to TypeScript Roguelike!");
        G.board.sounds.init();
    }
    static recalculateCanvasRects() {
        G._boardDisplay.rect = G._boardDisplay.getContainer().getBoundingClientRect();
        G._logDisplay.rect = G._logDisplay.getContainer().getBoundingClientRect();
    }
    static resumeSoundContext() {
        Pizzicato.context.resume();
    }
    static stopSoundContext() {
        Pizzicato.context.suspend();
    }
    static handleAction(action) {
        if (action.beforeLogCallback)
            G.log.write(action.beforeLogCallback());
        action.state = Enums_1.ActionState.PERFORMING;
        action.state = action.perform();
        if (action.afterLogCallback)
            G.log.write(action.afterLogCallback());
        if (action.state == Enums_1.ActionState.START_EFFECT)
            G.board.effects.handleEffects();
        else
            G.updateAndDrawBoard();
    }
    static updateAndDrawBoard() {
        G.board.actors.update();
        G.board.lights.update();
        G.player.computeFov();
        G.drawBoard();
        G.board.sounds.update();
    }
    static drawBoard() {
        G._boardDisplay.drawBoard(G.board, G.player.seenCells, G.player.percievedOpaqueColors);
    }
}
exports.default = G;
G._logDisplay = new LogDisplay_1.default();
G._boardDisplay = new BoardDisplay_1.default();

},{"./Board":15,"./Enums":17,"./actors/AnglerFish":28,"./actors/Goomba":29,"./actors/Player":30,"./displays/BoardDisplay":51,"./displays/LogDisplay":52,"./input/Input":58,"./logging/Log":60,"pizzicato":13,"rot-js":14}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Loop {
    set fps(fps) {
        this._fps = fps;
        this._changeEvery = 1000 / this._fps;
    }
    constructor(callback, stopCondition, finalize, fps = undefined) {
        this._fps = 14;
        this._changeEvery = 1000 / this._fps;
        this._elapsed = this._changeEvery;
        this._startStamp = null;
        this.doLoop = (timeStamp) => {
            if (!this._startStamp)
                this._startStamp = timeStamp;
            let dt = timeStamp - this._startStamp;
            this._startStamp = timeStamp;
            this.preCallBack(dt);
            if (this.stopCondition())
                this.finalize();
            else
                requestAnimationFrame(this.doLoop);
        };
        this.preCallBack = (dt) => {
            this._elapsed += dt;
            if (this._elapsed > this._changeEvery) {
                this._elapsed = 0;
                this.callback();
            }
        };
        this.callback = callback;
        this.stopCondition = stopCondition;
        this.finalize = finalize;
        this._fps = fps || this._fps;
    }
    start() {
        requestAnimationFrame(this.doLoop);
    }
}
exports.default = Loop;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("./../Enums");
const _Action_1 = require("./_Action");
class AttackAction extends _Action_1.default {
    constructor(actor) {
        super();
        this._actor = actor;
        return this;
    }
    perform() {
        this.logAfter(`*Poof!* You kick the ${this._actor.name}.`);
        this._actor.kill();
        return Enums_1.ActionState.SUCCESSFUL;
    }
}
exports.default = AttackAction;

},{"./../Enums":17,"./_Action":27}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Action_1 = require("./_Action");
class DebugAction extends _Action_1.default {
    constructor(perform) {
        super();
        this._func = perform;
        return this;
    }
    perform() {
        return this._func();
    }
}
exports.default = DebugAction;

},{"./_Action":27}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Action_1 = require("./_Action");
const Enums_1 = require("./../Enums");
class DigAction extends _Action_1.default {
    constructor(tile) {
        super();
        this._tile = tile;
        return this;
    }
    perform() {
        this._tile.dig();
        return Enums_1.ActionState.SUCCESSFUL;
    }
}
exports.default = DigAction;

},{"./../Enums":17,"./_Action":27}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UIController_1 = require("./../controllers/UIController");
const G_1 = require("./../G");
const GMath_1 = require("./../util/GMath");
const _Action_1 = require("./_Action");
const Enums_1 = require("./../Enums");
const FireBallEffect_1 = require("./../effects/FireBallEffect");
class FireballAction extends _Action_1.default {
    constructor() {
        super(...arguments);
        this.radius = 2.45;
    }
    target(start, end) {
        let aoeIcon = new UIController_1.Icon(' ', null, [0, 150, 30]);
        let lineIcon = new UIController_1.Icon('*', [255, 255, 255], null);
        let combinedIcon = new UIController_1.Icon('*', [255, 255, 255], [0, 150, 30]);
        let Unseen = new UIController_1.Icon('?', [200, 200, 175], null);
        let UnseenAndAoe = new UIController_1.Icon('?', [200, 200, 175], [0, 150, 30]);
        this.path = GMath_1.default.lineList(start, end, 1);
        let circle = GMath_1.default.cellWithinCircleSet(end, this.radius);
        for (let p of circle) {
            {
                if (!G_1.default.board.tiles.hasCell(p))
                    continue;
                let tile = G_1.default.board.tiles.getElementViaCell(p);
                if (tile.occupant() && G_1.default.player.seenCells.has(p))
                    G_1.default.board.icons.addIcon(p, new UIController_1.Icon(tile.occupant().glyph, tile.occupant().fgColor, [255, 50, 30]));
                else if (G_1.default.player.seenCells.has(p))
                    G_1.default.board.icons.addIcon(p, aoeIcon);
                else
                    G_1.default.board.icons.addIcon(p, new UIController_1.Icon(' ', null, [0, 100, 25]));
            }
        }
        for (let p of this.path) {
            let tile = G_1.default.board.tiles.getElementViaCell(p);
            switch (G_1.default.player.seenCells.has(p)) {
                case true:
                    if (tile.occupant())
                        G_1.default.board.icons.addIcon(p, new UIController_1.Icon(tile.occupant().glyph, tile.occupant().fgColor, [255, 50, 30]));
                    else if (circle.has(p))
                        G_1.default.board.icons.addIcon(p, combinedIcon);
                    else
                        G_1.default.board.icons.addIcon(p, lineIcon);
                    break;
                case false:
                    if (circle.has(p))
                        G_1.default.board.icons.addIcon(p, new UIController_1.Icon('?', null, [0, 100, 25]));
                    else
                        G_1.default.board.icons.addIcon(p, Unseen);
                    break;
            }
        }
    }
    perform() {
        var _a;
        G_1.default.board.effects.set((_a = this.path[0]) !== null && _a !== void 0 ? _a : G_1.default.player.position, new FireBallEffect_1.default(this.path));
        return Enums_1.ActionState.START_EFFECT;
    }
}
exports.default = FireballAction;

},{"./../Enums":17,"./../G":18,"./../controllers/UIController":50,"./../effects/FireBallEffect":55,"./../util/GMath":66,"./_Action":27}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("./../Enums");
const G_1 = require("./../G");
const _Action_1 = require("./_Action");
class MoveAction extends _Action_1.default {
    constructor(actor, dest) {
        super();
        this._actor = actor;
        this._dest = dest;
        return this;
    }
    perform() {
        G_1.default.board.actors.moveElementToCell(this._actor, this._dest);
        let tile = this._actor.tile;
        let log = tile.onEnter(this._actor);
        if (log)
            this.logAfter(log);
        return Enums_1.ActionState.SUCCESSFUL;
    }
}
exports.default = MoveAction;

},{"./../Enums":17,"./../G":18,"./_Action":27}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("./../Enums");
const _Action_1 = require("./_Action");
class SwitchAction extends _Action_1.default {
    constructor(activatable, setting) {
        super();
        this._activatable = activatable;
        this._setting = setting;
        return this;
    }
    perform() {
        switch (this._setting) {
            case Enums_1.SwitchSetting.ACTIVATE:
                this._activatable.activate();
                break;
            case Enums_1.SwitchSetting.DEACTIVATE:
                this._activatable.deactivate();
                break;
            case Enums_1.SwitchSetting.TOGGLE:
                this._activatable.toggle();
                break;
        }
        return Enums_1.ActionState.SUCCESSFUL;
    }
}
exports.default = SwitchAction;

},{"./../Enums":17,"./_Action":27}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Action_1 = require("./_Action");
class WaitAction extends _Action_1.default {
}
exports.default = WaitAction;

},{"./_Action":27}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("./../Enums");
class _Action {
    constructor() {
        this.state = Enums_1.ActionState.PENDING;
    }
    get beforeLogCallback() {
        return this._beforeLogCallback ? this._beforeLogCallback : undefined;
    }
    get afterLogCallback() {
        return this._afterLogCallback ? this._afterLogCallback : undefined;
    }
    logBefore(text) {
        this._beforeLogCallback = () => { return text; };
        return this;
    }
    logAfter(text) {
        this._afterLogCallback = () => { return text; };
        return this;
    }
    logBeforeConditional(conditionalTextCallback) {
        this._beforeLogCallback = conditionalTextCallback;
        return this;
    }
    logAfterConditional(conditionalTextCallback) {
        this._afterLogCallback = conditionalTextCallback;
        return this;
    }
    perform() {
        return Enums_1.ActionState.SUCCESSFUL;
    }
}
exports.default = _Action;

},{"./../Enums":17}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const MoveAction_1 = require("./../actions/MoveAction");
const G_1 = require("./../G");
const _Npc_1 = require("./_Npc");
const AttackAction_1 = require("./../actions/AttackAction");
const Light_1 = require("./../lights/Light");
class AnglerFish extends _Npc_1.default {
    constructor() {
        super();
        this.name = "Angler Fish";
        this._glyph = 'f';
        this._fgColor = rot_js_1.Color.fromString("blue");
        this._bgColor = null;
        this.alive = true;
        this.light = new Light_1.default(this, 3, [240, 50, 180]);
        G_1.default.board.lights.addLight(this.light);
    }
    act() {
        let action;
        let freeCell = [];
        let generator = G_1.default.board.tiles.iterateSurroundingPlane(this.position);
        for (let cellAndTile of generator) {
            const tile = cellAndTile[1];
            if (tile.occupant() == G_1.default.player) {
                action = new AttackAction_1.default(tile.occupant());
                break;
            }
            else if (tile.passable && !tile.occupant())
                freeCell.push(cellAndTile[0]);
        }
        if (!action) {
            let selection = rot_js_1.RNG.getItem(freeCell);
            if (selection)
                action = new MoveAction_1.default(this, selection);
        }
        if (action)
            action.perform();
    }
    kill() {
        G_1.default.board.lights.removeLight(this.light);
        G_1.default.board.actors.removeViaElement(this);
    }
}
exports.default = AnglerFish;

},{"./../G":18,"./../actions/AttackAction":20,"./../actions/MoveAction":24,"./../lights/Light":59,"./_Npc":32,"rot-js":14}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const MoveAction_1 = require("./../actions/MoveAction");
const G_1 = require("./../G");
const _Npc_1 = require("./_Npc");
const AttackAction_1 = require("./../actions/AttackAction");
class Goomba extends _Npc_1.default {
    constructor() {
        super();
        this.name = "Goomba";
        this._glyph = 'g';
        this._fgColor = rot_js_1.Color.fromString("orange");
        this._bgColor = null;
        this.alive = true;
    }
    act() {
        let action;
        let freeCell = [];
        let generator = G_1.default.board.tiles.iterateSurroundingPlane(this.position);
        for (let cellAndTile of generator) {
            const tile = cellAndTile[1];
            if (tile.occupant() == G_1.default.player) {
                action = new AttackAction_1.default(tile.occupant());
                break;
            }
            else if (tile.passable && !tile.occupant())
                freeCell.push(cellAndTile[0]);
        }
        if (!action) {
            let selection = rot_js_1.RNG.getItem(freeCell);
            if (selection)
                action = new MoveAction_1.default(this, selection);
        }
        if (action)
            action.perform();
    }
    kill() {
        G_1.default.board.actors.removeViaElement(this);
    }
}
exports.default = Goomba;

},{"./../G":18,"./../actions/AttackAction":20,"./../actions/MoveAction":24,"./_Npc":32,"rot-js":14}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const G_1 = require("../G");
const DebugAction_1 = require("../actions/DebugAction");
const Cell_1 = require("../util/Cell");
const Enums_1 = require("./../Enums");
const AttackAction_1 = require("./../actions/AttackAction");
const DigAction_1 = require("./../actions/DigAction");
const MoveAction_1 = require("./../actions/MoveAction");
const SwitchAction_1 = require("./../actions/SwitchAction");
const WaitAction_1 = require("./../actions/WaitAction");
const Sound_1 = require("./../audio/Sound");
const GlowingCrystalTile_1 = require("./../boardTiles/GlowingCrystalTile");
const _DiggableTile_1 = require("./../boardTiles/_DiggableTile");
const ExplosionEffectGenerator_1 = require("./../effects/ExplosionEffectGenerator");
const Light_1 = require("./../lights/Light");
const _Actor_1 = require("./_Actor");
class Player extends _Actor_1.default {
    get bgColor() {
        if (!G_1.default.board.lights.getBrightness(this.position))
            return [75, 0, 130];
        else
            return this._bgColor;
    }
    get sightRange() {
        return this.position.layer == Enums_1.Layer.BELOW ? 4 : 30;
    }
    constructor() {
        super();
        this.name = 'Player';
        this._glyph = '@';
        this._fgColor = [255, 0, 0];
        this._bgColor = null;
        this.seenCells = new Set();
        this.percievedOpaqueColors = new Map();
        this.sightPassesCallback = (x, y) => {
            let cell = Cell_1.default.get(x, y, this.position.layer);
            if (cell) {
                return G_1.default.board.tiles.getElementViaCell(cell).transparent;
            }
            else {
                return false;
            }
        };
        this.fovCallback = (x, y, r, visibility) => {
            let cell = Cell_1.default.get(x, y, this.position.layer);
            if (G_1.default.board.lights.getBrightness(cell)) {
                let tile = G_1.default.board.tiles.getElementViaCell(cell);
                if (tile.transparent) {
                    this.seenCells.add(cell);
                }
                else {
                    this.percievedOpaqueColors.set(cell, G_1.default.board.lights.baseColor);
                }
            }
        };
        this._fovAlgorithm = new rot_js_1.FOV.PreciseShadowcasting(this.sightPassesCallback);
        this._lightOrb = new Light_1.default(this, 4, [175, 175, 175]);
        G_1.default.board.lights.addLight(this._lightOrb);
    }
    computeFov() {
        const pos = this.position;
        this.seenCells.clear();
        this.percievedOpaqueColors.clear();
        this._fovAlgorithm.compute(pos.x, pos.y, this.sightRange, this.fovCallback);
        for (let opaqueCellAndColor of this.percievedOpaqueColors) {
            let cell = opaqueCellAndColor[0];
            let tile = G_1.default.board.tiles.getElementViaCell(cell);
            let percievedColor = G_1.default.board.lights.percievedLightColorOfOpaque(tile, this);
            if (percievedColor) {
                this.percievedOpaqueColors.set(cell, percievedColor);
                this.seenCells.add(cell);
            }
        }
        this.seenCells.add(pos);
        return this.seenCells;
    }
    getAction(keyCode) {
        switch (keyCode) {
            case 'Numpad8': return this.tryMove(this.position.neighbor(Enums_1.Dir.N));
            case 'Numpad9': return this.tryMove(this.position.neighbor(Enums_1.Dir.NE));
            case 'Numpad6': return this.tryMove(this.position.neighbor(Enums_1.Dir.E));
            case 'Numpad3': return this.tryMove(this.position.neighbor(Enums_1.Dir.SE));
            case 'Numpad2': return this.tryMove(this.position.neighbor(Enums_1.Dir.S));
            case 'Numpad1': return this.tryMove(this.position.neighbor(Enums_1.Dir.SW));
            case 'Numpad4': return this.tryMove(this.position.neighbor(Enums_1.Dir.W));
            case 'Numpad7': return this.tryMove(this.position.neighbor(Enums_1.Dir.NW));
            case 'Numpad5': return new WaitAction_1.default().logAfter("You wait..");
            case 'KeyL': return new SwitchAction_1.default(this._lightOrb, Enums_1.SwitchSetting.TOGGLE).logAfterConditional(() => {
                return this._lightOrb.isActive ? 'You summon a glowing orb.' : 'You wave your hand over your orb..';
            });
            case 'KeyC':
                let da = new DebugAction_1.default(() => {
                    let tile = G_1.default.board.tiles.getElementViaCell(this.position);
                    if (tile.name != "Glowing Crystal") {
                        G_1.default.board.tiles.replace(this.position, new GlowingCrystalTile_1.GlowingCrystalTile());
                        return Enums_1.ActionState.SUCCESSFUL;
                    }
                    else
                        return Enums_1.ActionState.UNSUCCESSFUL;
                }).logAfterConditional(() => { return da.state === Enums_1.ActionState.SUCCESSFUL ? "You place a glowing crystal." : "There is already a crystal here."; });
                return da;
            case 'KeyS':
                return new DebugAction_1.default(() => {
                    let s = new Sound_1.default('./../assets/audio/bbc_d-i-y--and_07045165.mp3', true, 18, G_1.default.board.tiles.getElementViaCell(G_1.default.player.position));
                    this.soundPos = this.position;
                    G_1.default.board.sounds.add(s);
                    G_1.default.board.sounds.update();
                    return Enums_1.ActionState.SUCCESSFUL;
                });
            case 'KeyE':
                return new DebugAction_1.default(() => {
                    let explosionGenerator = new ExplosionEffectGenerator_1.default(this.position, 2);
                    G_1.default.board.effects.addGenerator(explosionGenerator, true);
                    return Enums_1.ActionState.START_EFFECT;
                });
            default: return undefined;
        }
    }
    tryMove(destCell) {
        const destinationTile = G_1.default.board.tiles.getElementViaCell(destCell);
        const occupant = destinationTile.occupant();
        if (occupant) {
            return new AttackAction_1.default(occupant);
        }
        else if (!destinationTile.passable) {
            if (destinationTile instanceof _DiggableTile_1.default) {
                return new DigAction_1.default(destinationTile);
            }
            return undefined;
        }
        return new MoveAction_1.default(this, destCell);
    }
}
exports.default = Player;

},{"../G":18,"../actions/DebugAction":21,"../util/Cell":64,"./../Enums":17,"./../actions/AttackAction":20,"./../actions/DigAction":22,"./../actions/MoveAction":24,"./../actions/SwitchAction":25,"./../actions/WaitAction":26,"./../audio/Sound":33,"./../boardTiles/GlowingCrystalTile":38,"./../boardTiles/_DiggableTile":43,"./../effects/ExplosionEffectGenerator":54,"./../lights/Light":59,"./_Actor":31,"rot-js":14}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ngraph_path_1 = require("ngraph.path");
const G_1 = require("../G");
const Enums_1 = require("./../Enums");
class _Actor {
    constructor() {
        this.aStar = (0, ngraph_path_1.aStar)(G_1.default.board.graph.fetch, {
            distance(fromNode, toNode, link) {
                let fromTile = G_1.default.board.tiles.getElementViaCell(fromNode.data);
                let toTile = G_1.default.board.tiles.getElementViaCell(toNode.data);
                let toTileCost;
                if (toTile.name == "Wall")
                    return Number.POSITIVE_INFINITY;
                else if (toTile.name == "Cavern Grass") {
                    toTileCost = 5;
                }
                else if (toTile.layer == Enums_1.Layer.BELOW)
                    toTileCost = 3;
                else
                    toTileCost = 1;
                switch (link.data) {
                    case Enums_1.PathDir.DIAGONAL:
                        return toTileCost * 1.5;
                    case Enums_1.PathDir.VERTICAL:
                        if (fromTile.oppositeMovementValidFromHere())
                            return toTileCost * 5;
                        else
                            return Number.POSITIVE_INFINITY;
                    case Enums_1.PathDir.STRAIGHT:
                        return toTileCost;
                }
            },
        });
    }
    get glyph() {
        return this._glyph;
    }
    get fgColor() {
        return this._fgColor;
    }
    get bgColor() {
        return this._bgColor;
    }
    get position() {
        return G_1.default.board.actors.getCellViaElement(this);
    }
    get tile() {
        if (this.position)
            return G_1.default.board.tiles.getElementViaCell(this.position);
        else
            return undefined;
    }
    kill() {
    }
    act() {
    }
}
exports.default = _Actor;

},{"../G":18,"./../Enums":17,"ngraph.path":12}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Actor_1 = require("./_Actor");
class _Npc extends _Actor_1.default {
}
exports.default = _Npc;

},{"./_Actor":31}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pizzicato = require("pizzicato");
const G_1 = require("./../G");
class Sound {
    constructor(path, loop, intensity, attachedTo = undefined) {
        this._attachedTo = attachedTo;
        this.intensity = intensity;
        this.stereoPanner = new Pizzicato.Effects.StereoPanner({
            pan: 0.0
        });
        this.lowPassFilter = new Pizzicato.Effects.LowPassFilter({
            frequency: 22050,
            peak: 0.0001
        });
        this.pizzicatoSound = new Pizzicato.Sound({
            source: 'file',
            options: {
                path: path,
                loop: loop
            }
        }, this.onLoad.bind(this));
        this.pizzicatoSound.addEffect(this.lowPassFilter);
        this.pizzicatoSound.addEffect(this.stereoPanner);
        if (!loop)
            this.pizzicatoSound.on('end', this.destroy.bind(this));
    }
    get position() {
        if (this._attachedTo)
            return this._attachedTo.position;
        else
            return this._position;
    }
    get attachedTo() {
        return this._attachedTo;
    }
    attach(positional) {
        this._attachedTo = positional;
    }
    detach() {
        this._attachedTo = undefined;
    }
    onLoad() {
        this.pizzicatoSound.play();
    }
    destroy() {
        this.detach();
        this.pizzicatoSound.disconnect();
        G_1.default.board.sounds.remove(this);
    }
}
exports.default = Sound;

},{"./../G":18,"pizzicato":13}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderTile = void 0;
const _BoardTile_1 = require("./_BoardTile");
class BorderTile extends _BoardTile_1._BoardTile {
    constructor() {
        super(...arguments);
        this.name = 'Wall';
        this._glyph = ' ';
        this._fgColor = null;
        this._bgColor = [50, 50, 50];
        this.passable = false;
        this.topPassable = false;
        this.bottomPassable = false;
        this.transparent = false;
        this.destroyable = false;
    }
    getTraverseCost(actor) {
        return -1;
    }
}
exports.BorderTile = BorderTile;

},{"./_BoardTile":42}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CavernGrassTile = void 0;
const rot_js_1 = require("rot-js");
const _BoardTile_1 = require("./_BoardTile");
class CavernGrassTile extends _BoardTile_1._BoardTile {
    constructor() {
        super(...arguments);
        this.name = 'Cavern Grass';
        this._glyph = '"';
        this._fgColor = [35, 200, 100];
        this._bgColor = null;
        this.passable = true;
        this.topPassable = true;
        this.bottomPassable = false;
        this.transparent = true;
        this.destroyable = true;
    }
    onEnter(actor) {
        if (rot_js_1.RNG.getUniform() < .1)
            return "*Squish* *squish* The cavern grass is spongy";
        else
            return undefined;
    }
}
exports.CavernGrassTile = CavernGrassTile;

},{"./_BoardTile":42,"rot-js":14}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const _BoardTile_1 = require("./_BoardTile");
class CoralTile extends _BoardTile_1._BoardTile {
    constructor() {
        super();
        this.name = 'Coral';
        this._glyph = '&';
        this._bgColor = null;
        this.passable = true;
        this.topPassable = true;
        this.bottomPassable = false;
        this.transparent = true;
        this.destroyable = true;
        this.multiplyBelow = false;
        this._glyph = rot_js_1.RNG.getItem(['&', '"']);
        this._fgColor = rot_js_1.Color.randomize(rot_js_1.RNG.getUniform() < .5 ? [200, 25, 75] : [75, 25, 200], 50);
    }
}
exports.default = CoralTile;

},{"./_BoardTile":42,"rot-js":14}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorTile = void 0;
const _BoardTile_1 = require("./_BoardTile");
class FloorTile extends _BoardTile_1._BoardTile {
    constructor() {
        super(...arguments);
        this.name = 'Floor';
        this._glyph = '.';
        this._fgColor = [100, 100, 100];
        this._bgColor = null;
        this.passable = true;
        this.topPassable = true;
        this.bottomPassable = false;
        this.transparent = true;
        this.destroyable = true;
    }
}
exports.FloorTile = FloorTile;

},{"./_BoardTile":42}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlowingCrystalTile = void 0;
const rot_js_1 = require("rot-js");
const Light_1 = require("../lights/Light");
const G_1 = require("../G");
const _BoardTile_1 = require("./_BoardTile");
class GlowingCrystalTile extends _BoardTile_1._BoardTile {
    constructor() {
        super();
        this.name = 'Glowing Crystal';
        this._glyph = '*';
        this._bgColor = null;
        this.passable = true;
        this.topPassable = true;
        this.bottomPassable = false;
        this.transparent = true;
        this.destroyable = true;
        this._fgColor = [rot_js_1.RNG.getUniformInt(0, 75), rot_js_1.RNG.getUniformInt(155, 255), rot_js_1.RNG.getUniformInt(75, 255)];
        this.glow = new Light_1.default(this, rot_js_1.RNG.getUniformInt(3, 8), this._fgColor);
        G_1.default.board.lights.addLight(this.glow);
    }
    onEnter(actor) {
        return "The crystal is eerily cold to the touch.";
    }
    onRemove() {
        G_1.default.board.lights.removeLight(this.glow);
        this.glow = null;
    }
}
exports.GlowingCrystalTile = GlowingCrystalTile;

},{"../G":18,"../lights/Light":59,"./_BoardTile":42,"rot-js":14}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RubbleTile = void 0;
const rot_js_1 = require("rot-js");
const _BoardTile_1 = require("./_BoardTile");
class RubbleTile extends _BoardTile_1._BoardTile {
    constructor(color) {
        super();
        this.name = 'Rubble';
        this._glyph = ',';
        this._fgColor = [55, 85, 110];
        this._bgColor = null;
        this.passable = true;
        this.topPassable = true;
        this.bottomPassable = false;
        this.transparent = true;
        this.destroyable = false;
        this._glyph = rot_js_1.RNG.getItem(RubbleTile.possibleGlyphs);
        this._fgColor = rot_js_1.Color.randomize(color, 5);
    }
}
exports.RubbleTile = RubbleTile;
RubbleTile.possibleGlyphs = ['%', ',', ';', '`', ':', '.'];

},{"./_BoardTile":42,"rot-js":14}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallTile = void 0;
const _DiggableTile_1 = require("./_DiggableTile");
class WallTile extends _DiggableTile_1.default {
    constructor() {
        super(...arguments);
        this.name = 'Wall';
        this._glyph = ' ';
        this._fgColor = [0, 0, 0];
        this._bgColor = [25, 50, 75];
        this.passable = false;
        this.topPassable = false;
        this.bottomPassable = false;
        this.transparent = false;
        this.destroyable = true;
        this.digStrength = 3;
    }
}
exports.WallTile = WallTile;

},{"./_DiggableTile":43}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterTile = void 0;
const rot_js_1 = require("rot-js");
const Enums_1 = require("./../Enums");
const G_1 = require("../G");
const _BoardTile_1 = require("./_BoardTile");
class WaterTile extends _BoardTile_1._BoardTile {
    constructor() {
        super();
        this.name = 'Water';
        this._glyph = '~';
        this._fgColor = [20, 75, 210];
        this._bgColor = [6, 24, 63];
        this.passable = true;
        this.topPassable = true;
        this.bottomPassable = true;
        this.transparent = true;
        this.destroyable = false;
    }
    get glyph() {
        if (this.position.layer === Enums_1.Layer.ABOVE || this.upMovementValidFromHere())
            return this._glyph;
        else
            return '.';
    }
    get bgColor() {
        if (this.position.layer === Enums_1.Layer.ABOVE)
            return this._bgColor;
        else
            return null;
    }
    onEnter(actor) {
        if (actor === G_1.default.player)
            if (rot_js_1.RNG.getUniform() < .98)
                return "*Splash* You wade through some water...";
            else
                return "SOMETHING TRIES TO DRAG YOU UNDERWATER... and lets go";
        else
            return undefined;
    }
}
exports.WaterTile = WaterTile;

},{"../G":18,"./../Enums":17,"./_BoardTile":42,"rot-js":14}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._BoardTile = void 0;
const G_1 = require("../G");
const Enums_1 = require("./../Enums");
class _BoardTile {
    get glyph() {
        return this._glyph;
    }
    get fgColor() {
        return this._fgColor;
    }
    get bgColor() {
        return this._bgColor;
    }
    getTraverseCost(actor) {
        return 0;
    }
    constructor() {
        this.multiplyBelow = true;
    }
    get position() {
        return G_1.default.board.tiles.getCellViaElement(this);
    }
    get layer() {
        var _a;
        return (_a = this.position) === null || _a === void 0 ? void 0 : _a.layer;
    }
    onEnter(actor) {
        return undefined;
    }
    occupant() {
        const cell = this.position;
        return G_1.default.board.actors.hasCell(cell) ? G_1.default.board.actors.getElementViaCell(cell) : undefined;
    }
    opposite() {
        let p = this.position.oppositeCell();
        return G_1.default.board.tiles.getElementViaCell(p);
    }
    oppositeMovementValidFromHere() {
        switch (this.layer) {
            case Enums_1.Layer.ABOVE:
                return this.downMovementValidFromHere();
            case Enums_1.Layer.BELOW:
                return this.upMovementValidFromHere();
        }
    }
    upMovementValidFromHere() {
        return this.topPassable && this.opposite().bottomPassable;
    }
    downMovementValidFromHere() {
        return this.bottomPassable && this.opposite().topPassable;
    }
    upMovementValidToHere() {
        return this.bottomPassable && this.opposite().topPassable;
    }
    downMovementValidToHere() {
        return this.topPassable && this.opposite().bottomPassable;
    }
    onRemove() {
    }
}
exports._BoardTile = _BoardTile;

},{"../G":18,"./../Enums":17}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const G_1 = require("./../G");
const RubbleTile_1 = require("./RubbleTile");
const _BoardTile_1 = require("./_BoardTile");
class _DiggableTile extends _BoardTile_1._BoardTile {
    dig() {
        this.digStrength--;
        switch (this.digStrength) {
            case 2:
                this._glyph = rot_js_1.RNG.getItem([',', '`', '.']);
                break;
            case 1:
                this._glyph = rot_js_1.RNG.getItem(['%', ';', ':']);
                break;
            case 0:
                G_1.default.board.tiles.replace(this.position, new RubbleTile_1.RubbleTile(this._bgColor));
        }
    }
}
exports.default = _DiggableTile;

},{"./../G":18,"./RubbleTile":39,"./_BoardTile":42,"rot-js":14}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CellElementBiMap_1 = require("../util/CellElementBiMap");
class ActorController extends CellElementBiMap_1.default {
    update() {
        for (let actorAndCell of this.iterateElements()) {
            actorAndCell[0].act();
        }
    }
}
exports.default = ActorController;

},{"../util/CellElementBiMap":65}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const G_1 = require("./../G");
const Bfs_1 = require("./../util/Bfs");
const GMath_1 = require("./../util/GMath");
class AudioController {
    constructor() {
        this._sounds = new Set();
    }
    init() {
        this._bfs = new Bfs_1.default(G_1.default.board.graph.fetch, (fromCell, toCell, linkData) => {
            let layer = G_1.default.board.tiles.getElementViaCell(toCell).layer;
            let name = G_1.default.board.tiles.getElementViaCell(toCell).name;
            if (layer == 1)
                return Number.POSITIVE_INFINITY;
            if (name == "Wall")
                return 15;
            else
                return 1;
        });
    }
    update() {
        for (let s of this._sounds) {
            this.configSound(s);
        }
    }
    remove(sound) {
        this._sounds.delete(sound);
    }
    add(sound) {
        this._sounds.add(sound);
    }
    configSound(sound) {
        let soundMap = this._bfs.computeForDistance(sound.position, sound.intensity);
        if (!soundMap.has(G_1.default.player.position)) {
            sound.pizzicatoSound.volume = 0;
            return;
        }
        let bfsDistanceToPlayer = soundMap.get(G_1.default.player.position);
        let diagonalDistanceToPlayer = GMath_1.default.diagonalDistance(G_1.default.player.position, sound.position);
        let distanceNormal = GMath_1.default.normalize(bfsDistanceToPlayer, 0, sound.intensity + 1, 0, .75);
        let xDistance = GMath_1.default.clamp(sound.position.x - G_1.default.player.position.x, -10, 10);
        let xDistanceNormal = GMath_1.default.normalize(xDistance, -10, 10, -.5, .5);
        let ratio = diagonalDistanceToPlayer / bfsDistanceToPlayer;
        let muffle = 22050 * ratio;
        console.log(bfsDistanceToPlayer);
        console.log(diagonalDistanceToPlayer);
        console.log(ratio);
        sound.pizzicatoSound.volume = .75 - distanceNormal;
        sound.lowPassFilter.frequency = muffle;
        sound.stereoPanner.pan = xDistanceNormal;
    }
}
exports.default = AudioController;

},{"./../G":18,"./../util/Bfs":63,"./../util/GMath":66}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CellElementBiMap_1 = require("../util/CellElementBiMap");
const Enums_1 = require("./../Enums");
const G_1 = require("./../G");
const Loop_1 = require("./../Loop");
const Input_1 = require("./../input/Input");
class EffectsController extends CellElementBiMap_1.default {
    constructor() {
        super(...arguments);
        this._generators = new Set();
        this.updateAndDraw = () => {
            for (let gen of this._generators)
                gen.generate();
            for (let actionAndCell of G_1.default.board.effects.iterateElements()) {
                const action = actionAndCell[0];
                action.doStep();
            }
            G_1.default.board.lights.update();
            G_1.default.player.computeFov();
            G_1.default.board.sounds.update();
            G_1.default.drawBoard();
        };
    }
    addEffect(cell, effect, doStepImmediatly) {
        this.set(cell, effect);
        if (doStepImmediatly)
            effect.doStep();
    }
    addGenerator(generator, generateImmediatly) {
        this._generators.add(generator);
        if (generateImmediatly)
            generator.generate();
    }
    removeGenerator(generator) {
        this._generators.delete(generator);
    }
    handleEffects() {
        Input_1.default.SetState(Enums_1.InputState.EFFECT_LOOP);
        this.currentLoop = new Loop_1.default(this.updateAndDraw, () => { return this.count == 0 && this._generators.size == 0; }, this.finalize);
        this.currentLoop.start();
    }
    finalize() {
        Input_1.default.SetState(Enums_1.InputState.BOARD_CONTROL);
        G_1.default.updateAndDrawBoard();
    }
}
exports.default = EffectsController;

},{"../util/CellElementBiMap":65,"./../Enums":17,"./../G":18,"./../Loop":19,"./../input/Input":58}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C_1 = require("../C");
const Enums_1 = require("../Enums");
const Cell_1 = require("../util/Cell");
class GraphController {
    get fetch() {
        return this._boardGraph;
    }
    constructor() {
        this._boardGraph = require('ngraph.graph')();
        for (let x = 0; x < C_1.default.BOARD_WIDTH; x++) {
            for (let y = 0; y < C_1.default.BOARD_HEIGHT; y++) {
                for (let z = 0; z < C_1.default.BOARD_DEPTH; z++) {
                    let cell = Cell_1.default.get(x, y, z);
                    this._boardGraph.addNode(cell.key, cell);
                }
            }
        }
        for (let x = 0; x < C_1.default.BOARD_WIDTH; x++) {
            for (let y = 0; y < C_1.default.BOARD_HEIGHT; y++) {
                for (let z = 0; z < C_1.default.BOARD_DEPTH; z++) {
                    let cell = Cell_1.default.get(x, y, z);
                    if (z == 0)
                        this._boardGraph.addLink(cell.key, cell.oppositeCell().key, Enums_1.PathDir.VERTICAL);
                    for (let neighborAndDirection of cell.iterateNeighborsWithDirection()) {
                        let n = neighborAndDirection[0];
                        let d = neighborAndDirection[1];
                        if (this._boardGraph.getLink(n.key, cell.key))
                            continue;
                        let pathDir;
                        if (d == Enums_1.Dir.NE || d == Enums_1.Dir.NW || d == Enums_1.Dir.SE || d == Enums_1.Dir.SW)
                            pathDir = Enums_1.PathDir.DIAGONAL;
                        else
                            pathDir = Enums_1.PathDir.STRAIGHT;
                        this._boardGraph.addLink(cell.key, n.key, pathDir);
                    }
                }
            }
        }
    }
}
exports.default = GraphController;

},{"../C":16,"../Enums":17,"../util/Cell":64,"ngraph.graph":3}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const Cell_1 = require("../util/Cell");
const G_1 = require("./../G");
const GMath_1 = require("./../util/GMath");
class LightController {
    constructor() {
        this.baseColor = [0, 0, 0];
        this._lights = new Set();
        this._colorMap = new Map();
        this._brightnessMap = new Map();
    }
    update() {
        this._colorMap.clear();
        this._brightnessMap.clear();
        for (let light of this._lights) {
            light.update();
        }
    }
    addLight(light) {
        this._lights.add(light);
    }
    removeLight(light) {
        light.extinguish();
        this._lights.delete(light);
    }
    getColor(cell) {
        return this._colorMap.get(cell);
    }
    getBrightness(cell) {
        return this._brightnessMap.get(cell);
    }
    applyLight(x, y, layer, lightColor) {
        let cell = Cell_1.default.get(x, y, layer);
        let tile = G_1.default.board.tiles.getElementViaCell(cell);
        if (!tile.transparent) {
            this._brightnessMap.set(cell, -1);
            return;
        }
        let newColor;
        let existingColor = this._colorMap.get(cell);
        if (existingColor) {
            newColor = rot_js_1.Color.add(existingColor, lightColor);
            this._colorMap.set(cell, newColor);
        }
        else {
            newColor = rot_js_1.Color.add(this.baseColor, lightColor);
            this._colorMap.set(cell, newColor);
        }
        let brightness = (newColor[0] + newColor[1] + newColor[2]) / 3;
        brightness = GMath_1.default.normalize(brightness, 0, 255, 0, 10);
        this._brightnessMap.set(cell, brightness);
    }
    percievedLightColorOfOpaque(opaqueTile, sight) {
        let tilePos = opaqueTile.position;
        let brightestNeighborColor = undefined;
        let highestBrightness = 0;
        let surroundingTiles = G_1.default.board.tiles.iterateSurroundingPlane(tilePos);
        for (let neighborCellAndTile of surroundingTiles) {
            let cell = neighborCellAndTile[0];
            let tile = neighborCellAndTile[1];
            if (tile.transparent) {
                let inFov = sight.seenCells.has(cell);
                if (inFov) {
                    let brightness = this._brightnessMap.get(cell) || 0;
                    if (brightness > highestBrightness) {
                        brightestNeighborColor = this._colorMap.get(cell);
                        highestBrightness = brightness;
                    }
                }
            }
        }
        return brightestNeighborColor;
    }
}
exports.default = LightController;

},{"../util/Cell":64,"./../G":18,"./../util/GMath":66,"rot-js":14}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CellElementBiMap_1 = require("../util/CellElementBiMap");
class TileController extends CellElementBiMap_1.default {
    removeViaElement(element) {
        this._remove(element);
        super.removeViaElement(element);
    }
    removeViaCell(cell) {
        this._remove(this.getElementViaCell(cell));
        super.removeViaCell(cell);
    }
    _remove(tile) {
        tile.onRemove();
    }
}
exports.default = TileController;

},{"../util/CellElementBiMap":65}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = void 0;
class Icon {
    get glyph() {
        return this._glyph;
    }
    get fgColor() {
        return this._fgColor;
    }
    get bgColor() {
        return this._bgColor;
    }
    constructor(glyph, fgColor, bgColor) {
        this._glyph = glyph;
        this._fgColor = fgColor;
        this._bgColor = bgColor;
    }
}
exports.Icon = Icon;
Icon.TARGET_ICON = new Icon('*', [255, 255, 0], null);
class UIController {
    constructor() {
        this._cellToIconMap = new Map();
    }
    addIcon(cell, icon) {
        this._cellToIconMap.set(cell, icon);
    }
    hasIconAt(cell) {
        return this._cellToIconMap.has(cell);
    }
    clear() {
        this._cellToIconMap.clear();
    }
    *iterate() {
        for (let i of this._cellToIconMap)
            yield i;
    }
}
exports.default = UIController;

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const Enums_1 = require("./../Enums");
const C_1 = require("../C");
const G_1 = require("./../G");
class BoardDisplay extends rot_js_1.Display {
    constructor() {
        super(C_1.default.BOARD_DISPLAY_OPTIONS);
    }
    init() {
        this.rect = this.getContainer().getBoundingClientRect();
        this.widthInTiles = C_1.default.BOARD_WIDTH;
        this.heightInTiles = C_1.default.BOARD_HEIGHT;
        this.tileWidth = this.rect.width / this.widthInTiles;
        this.tileHeight = this.rect.height / this.heightInTiles;
    }
    drawBoard(board, seenTileCells, percievedOpaqueColors) {
        const tileLayer = board.tiles;
        const actorLayer = board.actors;
        const lightManager = G_1.default.board.lights;
        const actionLayer = G_1.default.board.effects;
        const icons = G_1.default.board.icons;
        this.clear();
        let tile;
        let fgDrawColor;
        let bgDrawColor;
        for (let seenCell of seenTileCells) {
            if (icons.hasIconAt(seenCell))
                continue;
            tile = tileLayer.getElementViaCell(seenCell);
            const position = tile.position;
            const belowLayer = position.layer == Enums_1.Layer.BELOW;
            const belowBlend = [0, 100, 255];
            if (actionLayer.hasCell(position)) {
                let action = actionLayer.getElementViaCell(position);
                fgDrawColor = this.convertColor(action.fgColor);
                bgDrawColor = this.convertColor(action.bgColor);
                this.draw(position.x, position.y, action.glyph, fgDrawColor, bgDrawColor);
            }
            else if (actorLayer.hasCell(position)) {
                let actor = actorLayer.getElementViaCell(position);
                fgDrawColor = this.convertColor(actor.fgColor);
                bgDrawColor = this.convertColor(actor.bgColor);
                this.draw(position.x, position.y, actor.glyph, fgDrawColor, bgDrawColor);
            }
            else if (!tile.transparent) {
                let percievedLightColor = percievedOpaqueColors.get(seenCell);
                if (belowLayer && tile.multiplyBelow) {
                    fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, percievedLightColor, belowBlend);
                    bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, percievedLightColor, belowBlend);
                }
                else {
                    fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, percievedLightColor);
                    bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, percievedLightColor);
                }
                this.draw(position.x, position.y, tile.glyph, fgDrawColor, bgDrawColor);
            }
            else {
                let lightColor = lightManager.getColor(position);
                if (belowLayer && tile.multiplyBelow) {
                    fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, lightColor, belowBlend);
                    bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, lightColor, belowBlend);
                }
                else {
                    fgDrawColor = this.multiplyAndConvertColor(tile.fgColor, lightColor);
                    bgDrawColor = this.multiplyAndConvertColor(tile.bgColor, lightColor);
                }
                this.draw(position.x, position.y, tile.glyph, fgDrawColor, bgDrawColor);
            }
        }
        for (let iconAndCell of icons.iterate()) {
            let icon = iconAndCell[1];
            let cell = iconAndCell[0];
            let fgDrawColor = this.convertColor(icon.fgColor);
            let bgDrawColor = this.convertColor(icon.bgColor);
            this.draw(cell.x, cell.y, icon.glyph, fgDrawColor, bgDrawColor);
        }
    }
    convertColor(color) {
        return !color ? null : rot_js_1.Color.toRGB(color);
    }
    multiplyAndConvertColor(color, ...multipliers) {
        return !color ? null : rot_js_1.Color.toRGB(rot_js_1.Color.multiply(color, ...multipliers));
    }
}
exports.default = BoardDisplay;

},{"../C":16,"./../Enums":17,"./../G":18,"rot-js":14}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const C_1 = require("../C");
class LogDisplay extends rot_js_1.Display {
    constructor() {
        super(C_1.default.LOG_DISPLAY_OPTIONS);
        this._startColor = [255, 255, 255];
        this._endColor = [60, 60, 60];
        this._colorCache = [];
        this.initColorCache();
    }
    initColorCache() {
        let interpolatedColor;
        let colorString;
        for (let i = 0; i <= C_1.default.LOG_DISPLAY_HEIGHT; i++) {
            interpolatedColor = rot_js_1.Color.interpolate(this._startColor, this._endColor, i / C_1.default.LOG_DISPLAY_HEIGHT);
            colorString = "%c{" + rot_js_1.Color.toRGB(interpolatedColor) + "}";
            this._colorCache.push(colorString);
        }
    }
    update(logList, repeatList) {
        this.clear();
        let repeat;
        let rowText;
        for (let i = 0; i <= C_1.default.LOG_DISPLAY_HEIGHT; i++) {
            repeat = repeatList[repeatList.length - i];
            repeat = repeat > 1 ? ` (${repeat}x)` : "";
            rowText = this._colorCache[i] + logList[logList.length - i] + repeat;
            this.drawText(0, C_1.default.LOG_DISPLAY_HEIGHT - i, rowText);
        }
    }
}
exports.default = LogDisplay;

},{"../C":16,"rot-js":14}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const G_1 = require("../G");
const Light_1 = require("../lights/Light");
const RubbleTile_1 = require("./../boardTiles/RubbleTile");
const _Effect_1 = require("./_Effect");
class ExplosionEffect extends _Effect_1.default {
    constructor() {
        super();
        this._glyph = '#';
        this._fgColor = null;
        this._bgColor = null;
        this.counter = 0;
        this._fgColor = rot_js_1.Color.randomize([255, 100, 22], 25);
        this._bgColor = rot_js_1.Color.randomize([235, 155, 15], 25);
        this.light = new Light_1.default(this, 12, rot_js_1.Color.interpolate(this._fgColor, this._bgColor, .5));
        G_1.default.board.lights.addLight(this.light);
    }
    doStep() {
        if (this.counter == 1) {
            let tile = G_1.default.board.tiles.getElementViaCell(this.position);
            if (tile.destroyable)
                if (tile.passable)
                    G_1.default.board.tiles.replace(this.position, new RubbleTile_1.RubbleTile(rot_js_1.Color.randomize([70, 70, 70], 8)));
                else if (rot_js_1.RNG.getUniform() < .75)
                    G_1.default.board.tiles.replace(this.position, new RubbleTile_1.RubbleTile(rot_js_1.Color.randomize([70, 70, 70], 8)));
            if (G_1.default.board.actors.hasCell(this.position)) {
                let actor = G_1.default.board.actors.getElementViaCell(this.position);
                actor.kill();
            }
        }
        else if (this.counter == 2) {
            this._glyph = '*';
        }
        else if (this.counter == 3) {
            this._bgColor = null;
            G_1.default.board.lights.removeLight(this.light);
        }
        else if (this.counter == 4) {
            G_1.default.board.effects.removeViaElement(this);
        }
        this.counter++;
    }
}
exports.default = ExplosionEffect;

},{"../G":18,"../lights/Light":59,"./../boardTiles/RubbleTile":39,"./_Effect":56,"rot-js":14}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const G_1 = require("./../G");
const Sound_1 = require("./../audio/Sound");
const ExplosionEffect_1 = require("./ExplosionEffect");
const _EffectGenerator_1 = require("./_EffectGenerator");
class ExplosionEffectGenerator extends _EffectGenerator_1.default {
    constructor(center, radius) {
        super();
        this.radius = 3;
        this.step = 0;
        this.center = center;
        this.radius = radius;
        this.sound = new Sound_1.default('./../assets/audio/explosion.mp3', false, 50);
        this.sound._position = center;
        G_1.default.board.sounds.add(this.sound);
    }
    generate() {
        if (this.step == 0) {
            let ee = new ExplosionEffect_1.default();
            G_1.default.board.effects.addEffect(this.center, ee, true);
        }
        else {
            for (let c of G_1.default.board.tiles.iterateCircumference(this.center, this.step + .45)) {
                if (G_1.default.board.tiles.hasCell(c[0])) {
                    let ee = new ExplosionEffect_1.default();
                    G_1.default.board.effects.addEffect(c[0], ee, false);
                }
            }
        }
        if (this.step == this.radius)
            G_1.default.board.effects.removeGenerator(this);
        this.step++;
    }
}
exports.default = ExplosionEffectGenerator;

},{"./../G":18,"./../audio/Sound":33,"./ExplosionEffect":53,"./_EffectGenerator":57}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const G_1 = require("../G");
const Light_1 = require("../lights/Light");
const Sound_1 = require("./../audio/Sound");
const ExplosionEffectGenerator_1 = require("./ExplosionEffectGenerator");
const _Effect_1 = require("./_Effect");
class FireballEffect extends _Effect_1.default {
    constructor(path) {
        super();
        this._glyph = '*';
        this._fgColor = [244, 135, 22];
        this._bgColor = null;
        this.step = 1;
        this.path = path;
        this.light = new Light_1.default(this, 8, this._fgColor);
        G_1.default.board.lights.addLight(this.light);
        this.sound = new Sound_1.default('./../assets/audio/whoosh.wav', false, 18, this);
        G_1.default.board.sounds.add(this.sound);
    }
    doStep() {
        if (this.step == this.path.length) {
            this.explode();
            return;
        }
        const cell = this.position;
        const tile = G_1.default.board.tiles.getElementViaCell(cell);
        if (!tile.passable || tile.occupant()) {
            this.explode();
        }
        else {
            this.lastCell = cell;
            let dest = this.path[this.step];
            let destTile = G_1.default.board.tiles.getElementViaCell(dest);
            if (!destTile.passable)
                this.explode();
            else
                G_1.default.board.effects.moveElementToCell(this, dest);
        }
        this.step++;
    }
    explode() {
        this.sound.destroy();
        const cell = this.position;
        G_1.default.board.effects.removeViaElement(this);
        G_1.default.board.lights.removeLight(this.light);
        G_1.default.log.write("*Boom!* The fireball explodes!");
        let explosionGenerator = new ExplosionEffectGenerator_1.default(cell, 2);
        G_1.default.board.effects.addGenerator(explosionGenerator, true);
    }
}
exports.default = FireballEffect;

},{"../G":18,"../lights/Light":59,"./../audio/Sound":33,"./ExplosionEffectGenerator":54,"./_Effect":56}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const G_1 = require("../G");
class _Effect {
    get glyph() {
        return this._glyph;
    }
    get fgColor() {
        return this._fgColor;
    }
    get bgColor() {
        return this._bgColor;
    }
    get position() {
        return G_1.default.board.effects.getCellViaElement(this);
    }
    doStep() {
    }
}
exports.default = _Effect;

},{"../G":18}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class _EffectGenerator {
    generate() {
    }
}
exports.default = _EffectGenerator;

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const G_1 = require("../G");
const Cell_1 = require("../util/Cell");
const Enums_1 = require("./../Enums");
const DebugAction_1 = require("./../actions/DebugAction");
const FireballAction_1 = require("./../actions/FireballAction");
const UIController_1 = require("./../controllers/UIController");
const Bfs_1 = require("./../util/Bfs");
class Input {
    static SetState(state) {
        Input._state = state;
    }
    static init(logDisplay, boardDisplay) {
        Input._logDisplay = logDisplay;
        Input._boardDisplay = boardDisplay;
        Input.setInputHandlers(logDisplay.getContainer(), boardDisplay.getContainer());
    }
    static setInputHandlers(logCanvas, boardCanvas) {
        Input._logCanvas = logCanvas;
        Input._boardCanvas = boardCanvas;
        Input._logCanvas.addEventListener('mouseover', () => { Input._mouseOverCanvas = Input._logCanvas; });
        Input._boardCanvas.setAttribute('tabindex', "1");
        Input._boardCanvas.addEventListener('mouseover', () => { Input._mouseOverCanvas = Input._boardCanvas; });
        Input._boardCanvas.addEventListener('mousemove', Input.handleMouseMoveOverBoard);
        Input._boardCanvas.addEventListener('click', Input.handleMouseClick);
        Input._boardCanvas.addEventListener('keydown', Input.handleKeyDown);
        Input._boardCanvas.focus();
    }
    static handleMouseMoveOverBoard(event) {
        let x = event.clientX - Input._boardDisplay.rect.left;
        let y = event.clientY - Input._boardDisplay.rect.top;
        let mouseTileX = Math.floor(x / Input._boardDisplay.tileWidth);
        let mouseTileY = Math.floor(y / Input._boardDisplay.tileHeight);
        let newCell = Cell_1.default.get(mouseTileX, mouseTileY, G_1.default.player.position.layer);
        if (newCell)
            Input._mouseBoardCell = newCell;
        switch (Input._state) {
            case Enums_1.InputState.BOARD_CONTROL:
                break;
            case Enums_1.InputState.TARGETING:
                Input.updateTargeting();
                break;
            case Enums_1.InputState.EFFECT_LOOP:
                break;
        }
    }
    static handleMouseClick(event) {
        switch (Input._state) {
            case Enums_1.InputState.BOARD_CONTROL:
                break;
            case Enums_1.InputState.TARGETING:
                Input.performTargetedAction();
                break;
            case Enums_1.InputState.EFFECT_LOOP:
                G_1.default.board.effects.currentLoop.fps = 60;
                break;
        }
    }
    static handleKeyDown(event) {
        let action;
        switch (Input._state) {
            case Enums_1.InputState.BOARD_CONTROL:
                action = Input.handleBoardControlKeyDown(event.code, event.shiftKey);
                break;
            case Enums_1.InputState.TARGETING:
                Input.handleTargetingKeyDown(event.code);
                break;
            case Enums_1.InputState.EFFECT_LOOP:
                break;
        }
        if (action) {
            event.preventDefault();
            G_1.default.handleAction(action);
        }
    }
    static handleBoardControlKeyDown(keycode, shift) {
        switch (keycode) {
            case "KeyF":
                Input.startTargeting();
                break;
            case "KeyP":
                return new DebugAction_1.default(() => {
                    G_1.default.board.icons.clear();
                    let start = G_1.default.player.soundPos;
                    let end = G_1.default.player.position;
                    let bfs = new Bfs_1.default(G_1.default.board.graph.fetch, (fromCell, toCell, linkData) => {
                        let layer = G_1.default.board.tiles.getElementViaCell(toCell).layer;
                        let name = G_1.default.board.tiles.getElementViaCell(toCell).name;
                        if (layer == 1)
                            return Number.POSITIVE_INFINITY;
                        if (name == "Wall")
                            return 15;
                        else
                            return 1;
                    });
                    let maxd = 18;
                    let result = bfs.computeForDistance(start, maxd);
                    console.log(result.size);
                    if (result)
                        for (let p of result) {
                            if (p[0] == start)
                                G_1.default.board.icons.addIcon(p[0], new UIController_1.Icon("x", null, [255, 0, 0]));
                            else if (p[0].layer != 1) {
                                let glyph = G_1.default.board.tiles.getElementViaCell(p[0]).glyph;
                                let fg = G_1.default.board.tiles.getElementViaCell(p[0]).fgColor;
                                G_1.default.board.icons.addIcon(p[0], new UIController_1.Icon(glyph, fg, [255 - p[1] * 12, p[1] * 6, p[1] * 12]));
                            }
                        }
                    return Enums_1.ActionState.SUCCESSFUL;
                }).logAfter('Path created.');
            case "Period":
                if (shift) {
                    let playerTile = G_1.default.player.tile;
                    if (G_1.default.player.position.layer === Enums_1.Layer.ABOVE && playerTile.downMovementValidFromHere())
                        return G_1.default.player.tryMove(playerTile.opposite().position);
                }
                break;
            case "Comma":
                if (shift) {
                    let playerTile = G_1.default.player.tile;
                    if (G_1.default.player.position.layer === Enums_1.Layer.BELOW && playerTile.upMovementValidFromHere())
                        return G_1.default.player.tryMove(playerTile.opposite().position);
                }
                break;
            default:
                return G_1.default.player.getAction(keycode);
        }
        return undefined;
    }
    static handleTargetingKeyDown(keycode) {
        switch (keycode) {
            case "Escape":
                Input.endTargeting();
                Input._state = Enums_1.InputState.BOARD_CONTROL;
                break;
        }
        return undefined;
    }
    static startTargeting() {
        Input._currentTargetedAction = new FireballAction_1.default();
        Input._state = Enums_1.InputState.TARGETING;
        Input.updateTargeting();
    }
    static updateTargeting() {
        G_1.default.board.icons.clear();
        Input._currentTargetedAction.target(G_1.default.player.position, Input._mouseBoardCell);
        G_1.default.drawBoard();
    }
    static endTargeting() {
        Input._currentTargetedAction = undefined;
        G_1.default.board.icons.clear();
        G_1.default.drawBoard();
    }
    static performTargetedAction() {
        let action = Input._currentTargetedAction;
        this.endTargeting();
        G_1.default.handleAction(action);
    }
}
exports.default = Input;
Input._state = Enums_1.InputState.BOARD_CONTROL;

},{"../G":18,"../util/Cell":64,"./../Enums":17,"./../actions/DebugAction":21,"./../actions/FireballAction":23,"./../controllers/UIController":50,"./../util/Bfs":63}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot_js_1 = require("rot-js");
const C_1 = require("../C");
const G_1 = require("../G");
const Cell_1 = require("../util/Cell");
class Light {
    constructor(attachedTo, intensity, color) {
        this._active = true;
        this.lightingCallback = (x, y, color) => {
            G_1.default.board.lights.applyLight(x, y, this._currentLayer, color);
        };
        this.lightPassingCallback = (x, y) => {
            let cell = Cell_1.default.get(x, y, this._currentLayer);
            if (cell) {
                return G_1.default.board.tiles.getElementViaCell(cell).transparent;
            }
            else {
                return false;
            }
        };
        this.reflectivityCallback = (x, y) => {
            let cell = Cell_1.default.get(x, y, this._currentLayer);
            if (cell && G_1.default.board.tiles.getElementViaCell(cell).transparent) {
                return C_1.default.LIGHT_DEFAULT_REFLECTIVITY;
            }
            else {
                return 0;
            }
        };
        this._attachedTo = attachedTo;
        this._distance = intensity;
        this._color = color;
        this._lightCone = new rot_js_1.FOV.PreciseShadowcasting(this.lightPassingCallback, { topology: 8 });
        this._lighting = new rot_js_1.Lighting(this.reflectivityCallback, { range: this._distance, passes: 2 })
            .setFOV(this._lightCone);
    }
    get isActive() {
        return this._active && this._attachedTo != undefined && this._attachedTo.position != undefined;
    }
    activate() {
        this._active = true;
    }
    deactivate() {
        this._active = false;
    }
    toggle() {
        this._active = !this._active;
        return this._active;
    }
    get attachedTo() {
        return this._attachedTo;
    }
    attach(positional) {
        this._attachedTo = positional;
    }
    detach() {
        this._attachedTo = undefined;
    }
    update() {
        if (this.isActive) {
            this.reposition(this._attachedTo.position);
            this._lighting.setFOV(this._lightCone);
            this._lighting.compute(this.lightingCallback);
        }
    }
    extinguish() {
        this.deactivate();
        this._lighting.clearLights();
    }
    reposition(cell) {
        this._lighting.clearLights();
        this._lighting.setLight(cell.x, cell.y, this._color);
        this._currentLayer = this._attachedTo.position.layer;
    }
}
exports.default = Light;

},{"../C":16,"../G":18,"../util/Cell":64,"rot-js":14}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C_1 = require("../C");
const Assertions_1 = require("../util/Assertions");
class Log {
    constructor(logDisplay) {
        this._logList = [];
        this._repeatList = [];
        this._logDisplay = logDisplay;
        for (let i = 0; i < C_1.default.LOG_DISPLAY_HEIGHT; i++) {
            this._logList.push("");
            this._repeatList.push(0);
        }
    }
    write(text) {
        (0, Assertions_1.assertTrue)(text.length > 0);
        const logList = this._logList;
        const repeatList = this._repeatList;
        if (text === logList[logList.length - 1]) {
            repeatList[repeatList.length - 1]++;
        }
        else {
            logList.push(text);
            repeatList.push(1);
        }
        this._logDisplay.update(logList, repeatList);
    }
}
exports.default = Log;

},{"../C":16,"../util/Assertions":62}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const G_1 = require("./G");
G_1.default.init();

},{"./G":18}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTrue = void 0;
function assertTrue(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}
exports.assertTrue = assertTrue;

},{}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeSearchStatePool = require('./../../node_modules/ngraph.path/a-star/makeSearchStatePool');
const NodeHeap = require('./../../node_modules/ngraph.path/a-star/NodeHeap.js');
const Assertions_1 = require("./Assertions");
const defaultSettings = require('./../../node_modules/ngraph.path/a-star/defaultSettings.js');
class Bfs {
    constructor(graph, distanceCallback) {
        this._distanceCallback = (fromCell, ToCell, linkData) => {
            return 1;
        };
        this._searchStatePool = makeSearchStatePool();
        this._nodeState = new Map();
        this._graph = graph;
        if (distanceCallback)
            this._distanceCallback = distanceCallback;
    }
    computeForDistance(startCell, maxDistance) {
        let from = this._graph.getNode(startCell.key);
        (0, Assertions_1.assertTrue)(from, 'Cell is not defined in this graph: ' + startCell.toString());
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
            if (this._cameFrom.distanceToSource > maxDistance) {
                this._nodeState.delete(this._cameFrom.node.id);
                continue;
            }
            this._graph.forEachLinkedNode(this._cameFrom.node.id, this.visitNeighbour.bind(this), false);
        }
        let result = new Map();
        for (let resultState of this._nodeState) {
            result.set(resultState[1].node.data, resultState[1].distanceToSource);
        }
        return result;
    }
    computeForDistanceWithMuffle(startCell, maxDistance) {
        let from = this._graph.getNode(startCell.key);
        (0, Assertions_1.assertTrue)(from, 'Cell is not defined in this graph: ' + startCell.toString());
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
            if (this._cameFrom.distanceToSource > maxDistance) {
                this._nodeState.delete(this._cameFrom.node.id);
                continue;
            }
            this._graph.forEachLinkedNode(this._cameFrom.node.id, this.visitNeighbourWithMuffle.bind(this), false);
        }
        let result = new Map();
        for (let resultState of this._nodeState) {
            result.set(resultState[1].node.data, [resultState[1].distanceToSource, resultState[1].node.muffle]);
        }
        return result;
    }
    visitNeighbourWithMuffle(otherNode, link) {
        var otherSearchState = this._nodeState.get(otherNode.id);
        if (!otherSearchState) {
            otherSearchState = this._searchStatePool.createNewState(otherNode);
            this._nodeState.set(otherNode.id, otherSearchState);
        }
        if (otherSearchState.closed) {
            return;
        }
        if (otherSearchState.open === 0) {
            this._openSet.push(otherSearchState);
            otherSearchState.open = 1;
        }
        let distanceCompute = this._distanceCallback(this._cameFrom.node.data, otherNode.data, link.data);
        var tentativeDistance = this._cameFrom.distanceToSource + distanceCompute;
        if (tentativeDistance >= otherSearchState.distanceToSource) {
            return;
        }
        otherSearchState.parent = this._cameFrom;
        otherSearchState.distanceToSource = tentativeDistance;
        otherSearchState.fScore = tentativeDistance;
        otherSearchState.muffle = distanceCompute == 15 ? true : false;
        this._openSet.updateItem(otherSearchState.heapIndex);
    }
    visitNeighbour(otherNode, link) {
        var otherSearchState = this._nodeState.get(otherNode.id);
        if (!otherSearchState) {
            otherSearchState = this._searchStatePool.createNewState(otherNode);
            this._nodeState.set(otherNode.id, otherSearchState);
        }
        if (otherSearchState.closed) {
            return;
        }
        if (otherSearchState.open === 0) {
            this._openSet.push(otherSearchState);
            otherSearchState.open = 1;
        }
        var tentativeDistance = this._cameFrom.distanceToSource + this._distanceCallback(this._cameFrom.node.data, otherNode.data, link.data);
        if (tentativeDistance >= otherSearchState.distanceToSource) {
            return;
        }
        otherSearchState.parent = this._cameFrom;
        otherSearchState.distanceToSource = tentativeDistance;
        otherSearchState.fScore = tentativeDistance;
        this._openSet.updateItem(otherSearchState.heapIndex);
    }
}
exports.default = Bfs;

},{"./../../node_modules/ngraph.path/a-star/NodeHeap.js":4,"./../../node_modules/ngraph.path/a-star/defaultSettings.js":7,"./../../node_modules/ngraph.path/a-star/makeSearchStatePool":9,"./Assertions":62}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C_1 = require("../C");
const Enums_1 = require("../Enums");
const _PLANE_OFFSETS = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
];
class Cell {
    constructor(x, y, layer) {
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.key = (C_1.default.BOARD_WIDTH * C_1.default.BOARD_HEIGHT * layer) + (C_1.default.BOARD_WIDTH * y) + x;
    }
    static get(x, y, layer) {
        if (Cell.xylValidBoardCell(x, y, layer))
            return Cell._cellCache[x][y][layer];
        else
            return null;
    }
    addToCell(cell) {
        return Cell.addCellToCell(this, cell, this.layer);
    }
    addToXY(xOffset, yOffset) {
        return Cell.addCellToXY(this, xOffset, yOffset, this.layer);
    }
    neighbor(dir) {
        let offset = _PLANE_OFFSETS[dir];
        return Cell.addCellToXY(this, offset[0], offset[1], this.layer);
    }
    oppositeCell() {
        return Cell._cellCache[this.x][this.y][this.oppositeLayer()];
    }
    oppositeLayer() {
        return this.layer == Enums_1.Layer.ABOVE ? Enums_1.Layer.BELOW : Enums_1.Layer.ABOVE;
    }
    *iterateNeighbors() {
        for (let offset of _PLANE_OFFSETS) {
            let neighbor = Cell.addCellToXY(this, offset[0], offset[1], this.layer);
            if (neighbor) {
                yield neighbor;
            }
        }
    }
    *iterateNeighborsWithDirection() {
        for (let dir = 0; dir < 8; dir++) {
            let offset = _PLANE_OFFSETS[dir];
            let neighbor = Cell.addCellToXY(this, offset[0], offset[1], this.layer);
            if (neighbor) {
                yield [neighbor, dir];
            }
        }
    }
    onEdge() {
        return Cell.cellOnEdge(this);
    }
    toString() {
        return `(${this.x}, ${this.y}, ${this.layer})`;
    }
    static addCellToCell(cellA, cellB, layer) {
        let newX = cellA.x + cellB.x;
        let newY = cellA.y + cellB.y;
        return Cell.get(newX, newY, layer);
    }
    static addCellToXY(cell, xOffset, yOffset, layer) {
        let newX = cell.x + xOffset;
        let newY = cell.y + yOffset;
        return Cell.get(newX, newY, layer);
    }
    static xylValidBoardCell(x, y, layer) {
        return x >= 0 && x < C_1.default.BOARD_WIDTH
            && y >= 0 && y < C_1.default.BOARD_HEIGHT
            && layer >= 0 && layer < C_1.default.BOARD_DEPTH;
    }
    static cellOnEdge(cell) {
        return cell.x == 0 || cell.x == C_1.default.BOARD_WIDTH - 1 || cell.y == 0 || cell.y == C_1.default.BOARD_HEIGHT - 1;
    }
    static xyOnEdge(x, y) {
        return x == 0 || x == C_1.default.BOARD_WIDTH - 1 || y == 0 || y == C_1.default.BOARD_HEIGHT - 1;
    }
}
exports.default = Cell;
Cell._initialize = (() => {
    Cell._cellCache = [];
    for (let x = 0; x < C_1.default.BOARD_WIDTH; x++) {
        Cell._cellCache[x] = [];
        for (let y = 0; y < C_1.default.BOARD_HEIGHT; y++) {
            Cell._cellCache[x][y] = [];
            for (let z = 0; z < C_1.default.BOARD_DEPTH; z++) {
                let cell = new Cell(x, y, z);
                Cell._cellCache[x][y][z] = cell;
            }
        }
    }
})();

},{"../C":16,"../Enums":17}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("./Assertions");
const GMath_1 = require("./GMath");
const Cell_1 = require("./Cell");
class CellElementBiMap {
    constructor() {
        this._elementToCell = new Map();
        this._cellToElement = new Map();
    }
    get count() {
        return this._elementToCell.size;
    }
    set(cell, element) {
        (0, Assertions_1.assertTrue)(this._cellToElement.has(cell) === false);
        (0, Assertions_1.assertTrue)(this._elementToCell.has(element) === false);
        this._cellToElement.set(cell, element);
        this._elementToCell.set(element, cell);
    }
    removeViaElement(element) {
        (0, Assertions_1.assertTrue)(this._elementToCell.has(element));
        const cell = this._elementToCell.get(element);
        this._elementToCell.delete(element);
        this._cellToElement.delete(cell);
    }
    removeViaCell(cell) {
        (0, Assertions_1.assertTrue)(this._cellToElement.has(cell));
        let element = this._cellToElement.get(cell);
        this._cellToElement.delete(cell);
        this._elementToCell.delete(element);
    }
    clear() {
        this._elementToCell.clear();
        this._cellToElement.clear();
    }
    hasElement(element) {
        return this._elementToCell.has(element);
    }
    hasCell(cell) {
        return this._cellToElement.has(cell);
    }
    hasXYZ(x, y, z) {
        return this._cellToElement.has(Cell_1.default.get(x, y, z));
    }
    getElementViaCell(cell) {
        (0, Assertions_1.assertTrue)(this._cellToElement.has(cell));
        return this._cellToElement.get(cell);
    }
    getElementViaXYZ(x, y, z) {
        const cell = Cell_1.default.get(x, y, z);
        (0, Assertions_1.assertTrue)(this._cellToElement.has(cell));
        return this._cellToElement.get(cell);
    }
    getCellViaElement(element) {
        return this._elementToCell.get(element);
    }
    replace(cell, element) {
        this.removeViaCell(cell);
        this.set(cell, element);
    }
    moveElementToCell(element, destCell) {
        (0, Assertions_1.assertTrue)(this._elementToCell.has(element));
        (0, Assertions_1.assertTrue)(this._cellToElement.has(destCell) === false);
        this.removeViaElement(element);
        this.set(destCell, element);
    }
    iterateElements() {
        return [...this._elementToCell];
    }
    *iterateSurroundingPlane(center) {
        for (let p of center.iterateNeighbors()) {
            const e = this._cellToElement.get(p);
            yield [p, e];
        }
    }
    *iterateCircle(center, radius) {
        for (let p of GMath_1.default.iterateCellsWithinCircle(center, radius))
            yield [p, this._cellToElement.get(p)];
    }
    *iterateCircumference(center, radius) {
        for (let p of GMath_1.default.iterateCellsOnCircumference(center, radius))
            yield [p, this._cellToElement.get(p)];
    }
}
exports.default = CellElementBiMap;

},{"./Assertions":62,"./Cell":64,"./GMath":66}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("./Assertions");
const Cell_1 = require("./Cell");
class GMath {
    static clamp(x, min, max) {
        return Math.min(Math.max(x, min), max);
    }
    ;
    static normalize(x, minX, maxX, betweenA = 0, betweenB = 1) {
        return (betweenB - betweenA) * (x - minX) / (maxX - minX) + betweenA;
    }
    ;
    static lerp(start, end, t) {
        return start + t * (end - start);
    }
    static lerpCell(p0, p1, t) {
        (0, Assertions_1.assertTrue)(p0.layer == p1.layer);
        let x = Math.round(GMath.lerp(p0.x, p1.x, t));
        let y = Math.round(GMath.lerp(p0.y, p1.y, t));
        return Cell_1.default.get(x, y, p0.layer);
    }
    static diagonalDistance(p0, p1) {
        let dx = p1.x - p0.x;
        let dy = p1.y - p0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    }
    static *iterateLineCells(p0, p1, skipStart = 0, skipEnd = 0) {
        let N = GMath.diagonalDistance(p0, p1);
        for (let step = skipStart; step <= N - skipEnd; step++) {
            let t = N === 0 ? 0.0 : step / N;
            let lerpedCell = GMath.lerpCell(p0, p1, t);
            if (lerpedCell)
                yield lerpedCell;
        }
    }
    static lineList(p0, p1, skipStart = 0, skipEnd = 0) {
        let cells = [];
        for (let p of GMath.iterateLineCells(p0, p1, skipStart, skipEnd)) {
            cells.push(p);
        }
        return cells;
    }
    static lineSet(p0, p1, skipStart = 0, skipEnd = 0) {
        let Cell = new Set();
        for (let c of GMath.iterateLineCells(p0, p1, skipStart, skipEnd)) {
            Cell.add(c);
        }
        return Cell;
    }
    static *iterateCellsWithinCircle(center, radius) {
        let top = Math.floor(center.y - radius);
        let bottom = Math.floor(center.y + radius);
        for (let y = top; y <= bottom; y++) {
            let dy = y - center.y;
            let dx = Math.sqrt(radius * radius - dy * dy);
            let left = Math.ceil(center.x - dx);
            let right = Math.floor(center.x + dx);
            for (let x = left; x <= right; x++) {
                let cell = Cell_1.default.get(x, y, center.layer);
                if (cell)
                    yield cell;
            }
        }
    }
    static cellWithinCircleSet(center, radius) {
        let set = new Set();
        for (let p of GMath.iterateCellsWithinCircle(center, radius))
            set.add(p);
        return set;
    }
    static cellIsInsideCircle(center, x, y, radius) {
        let dx = center.x - x;
        let dy = center.y - y;
        let distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= radius * radius;
    }
    static *iterateCellsOnCircumference(center, radius) {
        let dupes = new Set();
        for (let r = 0; r <= Math.floor(radius * Math.SQRT1_2); r++) {
            let d = Math.floor(Math.sqrt(radius * radius - r * r));
            let p0 = Cell_1.default.get(center.x - d, center.y + r, center.layer);
            let p1 = Cell_1.default.get(center.x + d, center.y + r, center.layer);
            let p2 = Cell_1.default.get(center.x - d, center.y - r, center.layer);
            let p3 = Cell_1.default.get(center.x + d, center.y - r, center.layer);
            let p4 = Cell_1.default.get(center.x + r, center.y - d, center.layer);
            let p5 = Cell_1.default.get(center.x + r, center.y + d, center.layer);
            let p6 = Cell_1.default.get(center.x - r, center.y - d, center.layer);
            let p7 = Cell_1.default.get(center.x - r, center.y + d, center.layer);
            if (r == 0 || r == d) {
                if (p0 && !dupes.has(p0)) {
                    dupes.add(p0);
                    yield p0;
                }
                if (p1 && !dupes.has(p1)) {
                    dupes.add(p1);
                    yield p1;
                }
                if (p2 && !dupes.has(p2)) {
                    dupes.add(p2);
                    yield p2;
                }
                if (p3 && !dupes.has(p3)) {
                    dupes.add(p3);
                    yield p3;
                }
                if (p4 && !dupes.has(p4)) {
                    dupes.add(p4);
                    yield p4;
                }
                if (p5 && !dupes.has(p5)) {
                    dupes.add(p5);
                    yield p5;
                }
                if (p6 && !dupes.has(p6)) {
                    dupes.add(p6);
                    yield p6;
                }
                if (p7 && !dupes.has(p7)) {
                    dupes.add(p7);
                    yield p7;
                }
            }
            else {
                if (p0)
                    yield p0;
                if (p1)
                    yield p1;
                if (p2)
                    yield p2;
                if (p3)
                    yield p3;
                if (p4)
                    yield p4;
                if (p5)
                    yield p5;
                if (p6)
                    yield p6;
                if (p7)
                    yield p7;
            }
        }
    }
    static cellsOnCircumferenceSet(center, radius) {
        let cellSet = new Set();
        for (let p of GMath.iterateCellsOnCircumference(center, radius))
            cellSet.add(p);
        return cellSet;
    }
}
exports.default = GMath;

},{"./Assertions":62,"./Cell":64}]},{},[61]);
