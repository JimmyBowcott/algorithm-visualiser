const MAX_HEIGHT = 4;

export class Node {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
      this.key = null;
      this.height = 1;
    }
  }
  
export class AVL {
  constructor() {
    this.root = null;
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  insertNode(node, value, height=1) {
    if (!node) {
      if (height > MAX_HEIGHT) {
        value = Math.floor(Math.random() * 100);
        this.insert(value)
        return
      }
      return new Node(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value, height+1);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value, height+1);
    } else {
      return node;
    }

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    const balance = this.getBalance(node);

    if (balance > 1 && value < node.left.value) {
      return this.rotateRight(node);
    }

    if (balance < -1 && value > node.right.value) {
      return this.rotateLeft(node);
    }

    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  remove(value) {
    this.root = this.removeNode(this.root, value);
  }

  pop() {
    const value = this.levelOrder();
    if (value) {
      this.remove(value);
    }
  }

  removeNode(node, value) {
    if (!node) {
      return node;
    }

    if (value < node.value) {
      node.left = this.removeNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.removeNode(node.right, value);
    } else {
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      }

      node.value = this.findMinValue(node.right);
      node.right = this.removeNode(node.right, node.value);
    }

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    const balance = this.getBalance(node);

    if (balance > 1 && this.getBalance(node.left) >= 0) {
      return this.rotateRight(node);
    }

    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && this.getBalance(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  clone() {
    const newTree = new AVL();
    newTree.root = this.cloneNode(this.root);
    return newTree;
  }

  cloneNode(node) {
    if (!node) return null;
    const newNode = new Node(node.value);
    newNode.left = this.cloneNode(node.left);
    newNode.right = this.cloneNode(node.right);
    newNode.height = node.height;
    return newNode;
  }

  // Helper functions
  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  findMinValue(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current.value;
  }

  // Right rotate
  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    return x;
  }

  // Left rotate
  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    return y;
  }

  levelOrder() {
    if (this.root) {
        const result = [];
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            result.push(node.value);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return result;
    }
    return [];
  }
}

export default AVL