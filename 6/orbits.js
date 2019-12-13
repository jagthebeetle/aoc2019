const fs = require('fs');

const adjacencies = fs.readFileSync('input.txt', 'utf8').split('\n');
const testAdjacencies = [
  'COM)B',
  'B)C',
  'C)D',
  'D)E',
  'E)F',
  'B)G',
  'G)H',
  'D)I',
  'E)J',
  'J)K',
  'K)L',
];
const adjacencyList = buildGraph(adjacencies, false);
console.info(shortestPath(adjacencyList, 'YOU', 'SAN'));
// console.info(adjacencyList);

function buildGraph(adjacencies, directed = true) {
  const adjacencyList = {};
  for (const adjacency of adjacencies) {
    if (adjacency === '') {
      continue;
    }
    const [parent, child] = adjacency.split(')');
    adjacencyList[parent] = adjacencyList[parent] || nodeOf(parent);
    adjacencyList[child] = adjacencyList[child] || nodeOf(child);
    adjacencyList[parent].children.push(child);
    if (!directed) {
      adjacencyList[child].children.push(parent);
    }
  }
  return adjacencyList;
}

function nodeOf(id) {
  return {
    id,
    children: [],
  };
}

function shortestPath(list, a, b) {
  for (const node of Object.values(list)) {
    node.weight = Infinity;
  }
  list[a].weight = 0;

  const queue = [list[a]];
  while (queue.length) {
    const cur = queue.shift();
    for (const child of cur.children) {
      const childNode = list[child];
      if (childNode.done) {
        continue;
      }
      const proposedWeight = cur.weight + 1;
      if (proposedWeight < childNode.weight) {
        console.info(
            `setting ${childNode.id} to lower weight of ${proposedWeight}`);
        childNode.weight = proposedWeight;
      }
      queue.push(childNode);
    }
    cur.done = true;
  }
  return list[b];
}

/**
 *
 * @param {Object<string, string[]>} list
 * @param {string} rootNode
 * @param {number=} weight
 */
function walkGraph(list, rootNode, weight = 0) {
  console.info(`walking ${rootNode} with weight ${weight}`);
  const node = list[rootNode];
  if (!node) {
    return weight;
  }
  let acc = weight;
  for (const child of node) {
    acc += walkGraph(list, child, weight + 1);
  }
  return acc;
}
