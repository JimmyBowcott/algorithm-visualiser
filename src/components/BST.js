class Node {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  
  class BST {
    constructor() {
      this.root = null;
      this.lastNode = [];
    }
  
    insert(value) {
      const newNode = new Node(value);
      if (!this.root) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode);
      }
      this.lastNode.push(newNode.value);
    }
  
    insertNode(currentNode, newNode) {
      if (newNode.value < currentNode.value) {
        if (!currentNode.left) {
          currentNode.left = newNode;
        } else {
          this.insertNode(currentNode.left, newNode);
        }
      } else {
        if (!currentNode.right) {
          currentNode.right = newNode;
        } else {
          this.insertNode(currentNode.right, newNode);
        }
      }
    }

  pop() {
    this.root = this.removeLastNode();
  }

  removeLastNode() {
    let node = this.root
    let value = this.lastNode.pop();
    if (!node) {
      return null;
    }

    if (value < node.value) {
      node.left = this.removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.removeNode(node.right, value);
      return node;
    } else {

      if (!node.left && !node.right) {
        return null;
      }
    
      return node;
      }
    }

  findMinNode(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}

export default BST