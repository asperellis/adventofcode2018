const readInput = require('./utils/readInput');

readInput(8, data => {
  class Node {
    constructor(header) {
      this.header = header;
      this.children = [];
      this.metadata = [];
      this.value;
    }
  }

  // builds the tree with given data
  const buildTree = data => {
    let treeData = data.split(' ');

    const makeNode = () => {
      const nodeHeader = treeData.slice(0, 2).map(Number);
      const [childCount, metaCount] = nodeHeader;
      const node = new Node(nodeHeader);
      treeData = treeData.slice(2);

      if (childCount) {
        for (let c = 0; c < childCount; c++) {
          node.children.push(makeNode(treeData));
        }
      }

      if (metaCount) {
        node.metadata = treeData.slice(0, metaCount).map(Number);
        treeData = treeData.slice(metaCount);
        if (!childCount) {
          node.value = node.metadata.reduce((sum, m) => sum + m, 0);
        }
      }

      if (metaCount && childCount) {
        node.value = node.metadata.reduce(
          (val, m) =>
            node.children[m - 1] ? val + node.children[m - 1].value : val,
          0
        );
      }

      return node;
    };

    return makeNode(treeData);
  };

  // gets the sum of the trees metadata
  const getMetaSum = tree => {
    const getSum = node => {
      let sum = 0;

      if (node.children.length) {
        for (const child of node.children) {
          sum += getSum(child);
        }
      }

      return (sum += node.metadata.reduce((sum, m) => sum + m, 0));
    };

    return getSum(tree);
  };

  const tree = buildTree(data);

  // PART 1
  console.log(getMetaSum(tree));

  // PART 2
  console.log(tree.value);
});
