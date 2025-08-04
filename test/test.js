// Number of nodes
let n = 7,
  root = 1;

// Adjacency list to store the tree
let adj = new Array(n + 1).fill(null).map(() => []);

// Creating the tree
addEdge(1, 2, adj);
addEdge(1, 3, adj);
addEdge(1, 4, adj);
addEdge(2, 5, adj);
addEdge(2, 6, adj);
addEdge(4, 7, adj);

// Function to add an edge between vertices x and y
function addEdge(x, y, arr) {
  arr[x].push(y);
  arr[y].push(x);
}

// Function to print the parent of each node
function printParents(node, arr, parent) {
  // current node is Root, thus, has no parent
  if (parent == 0) console.log(`${node}->root`);
  else console.log(`${node}->${parent}`);

  // Using DFS
  for (let cur of arr[node]) if (cur != parent) printParents(cur, arr, node);
}

// Function to print the children of each node
function printChildren(root, arr) {
  // Queue for the BFS
  let q = [];

  // pushing the root
  q.push(root);

  // visit array to keep track of nodes
  // that have been visited
  let vis = new Array(arr.length).fill(0);

  // BFS
  while (q.length > 0) {
    let node = q.shift();
    vis[node] = 1;
    console.log(`${node}-> `);
    for (let cur of arr[node])
      if (vis[cur] == 0) {
        console.log(cur + ' ');
        q.push(cur);
      }
    console.log('\n');
  }
}

// Function to print the leaf nodes
function printLeafNodes(root, arr) {
  // Leaf nodes have only one edge
  // and are not the root
  for (let i = 1; i < arr.length; i++)
    if (arr[i].length == 1 && i != root) console.log(i + ' ');
  console.log('\n');
}

// Function to print the degrees of each node
function printDegrees(Root, arr) {
  for (let i = 1; i < arr.length; i++) {
    console.log(`${i}: `);

    // Root has no parent, thus, its degree is equal to
    // the edges it is connected to
    if (i == root) console.log(arr[i].length + '\n');
    else console.log(arr[i].length - 1 + '\n');
  }
}

// Function to print the tree in a hierarchical format
function printTree(node, arr, parent, level) {
  // Indent based on the level of the node
  console.log('  '.repeat(level) + '└── ' + node);

  // Recursively print children
  for (let cur of arr[node])
    if (cur != parent) printTree(cur, arr, node, level + 1);
}

// Driver code

// Printing the tree in a hierarchical format
console.log('Tree Structure:');
printTree(root, adj, 0, 0);

// Printing the parents of each node
console.log('\nThe parents of each node are:');
printParents(root, adj, 0);

// Printing the children of each node
console.log('\nThe children of each node are:');
printChildren(root, adj);

// Printing the leaf nodes in the tree
console.log('\nThe leaf nodes of the tree are:');
printLeafNodes(root, adj);

// Printing the degrees of each node
console.log('\nThe degrees of each node are:');
printDegrees(root, adj);

