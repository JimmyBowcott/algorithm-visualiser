import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AVL from './AVL';
import Node from './Node';
import PropTypes from "prop-types";

// Hacky way of tracking child IDs
const CHILD_IDs = {
  0: {left: 1, right: 2},
  1: {left: 3, right: 4},
  2: {left: 5, right: 6},
  3: {left: 7, right: 8},
  4: {left: 9, right: 10},
  5: {left: 11, right: 12},
  6: {left: 13, right: 14},
}

const Tree = ({type="Breath-first-search"}) => {
    const [avl, setAvl] = useState(new AVL());
    const [avlWithKeys, setAvlWithKeys] = useState(new AVL()); // This is needed to avoid infinite loops when setting keys 
    const [active, setActive] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [arrayLength, setArrayLength] = useState(9);
    const [selectedData, setSelectedData] = useState([0,0]);
    const [displayArray, setDisplayArray] = useState(null);
    const stepDelay = 750;
    const navigate = useNavigate();

    const handleTypeChange = (e) => {
      navigate(`/tree?type=${e.target.value}`)
      setDisplayArray(null);
  }

    const handleGenerateRandom = useCallback(() => {
      const randomNumbers = Array.from({ length: arrayLength }, () => Math.floor(Math.random() * 100));
      const newAvl = new AVL();
      randomNumbers.forEach((num) => newAvl.insert(num));
      setAvl(newAvl);
    }, [arrayLength]);

    useEffect(() => {
      handleGenerateRandom();
    }, [handleGenerateRandom])
  
    const insertNode = () => {
      // hacky approach, limit to 12 max.
      if (arrayLength >= 12) return;
      const value = Math.floor(Math.random() * 100);
      const newTree = avl.clone();
      newTree.insert(value);
      setAvl(newTree);
      setArrayLength(arrayLength + 1);
    };
  
    const popNode = () => {
      if (arrayLength <= 1) return;
      const newTree = avl.clone();
      newTree.pop();
      setAvl(newTree);
      setArrayLength(arrayLength - 1);
    };
  
    const handleInsert = () => {
      insertNode();
    };
  
    const handlePop = () => {
      popNode()
    };

    const handleSearchInput = (e) => {
      const index = selectedData[1];
      const newValue = e.target.value;
      if (newValue > selectedData[0] && index < sortedData.length-1) {
        setSelectedData([sortedData[index+1], index+1]);
      } else if (newValue < selectedData[0] && index > 0) {
        setSelectedData([sortedData[index-1], index-1]);
      }
    }
  

    // Traversal for tree display
    const levelOrder = useCallback(() => {
      if (avl.root) {
          let newAvl = avl.clone();
          const result = [];
          const queue = [[newAvl.root, 0]];
          while (queue.length) {
              const [node, nodeId] = queue.shift();
              if (node) {
                  node.key = nodeId;
                  result.push([node.value, nodeId]);
                  if (nodeId <= 6) { // Hacky, need to remember this is here
                  queue.push([node.left, CHILD_IDs[nodeId].left]);
                  queue.push([node.right, CHILD_IDs[nodeId].right]);
                }
              }
          }
          setAvlWithKeys(newAvl);
          return result;
      }
      return [];
    }, [avl]);
    
    // Handle changes to tree structure
    const handleChange = useCallback(() => {
      const data = levelOrder();
      setTreeData(data);
      const sortedData = data.map(item => item[0]).sort();
      setSortedData(sortedData);
      const randomData = Math.floor(Math.random() * data.length);
      setSelectedData([sortedData[randomData], randomData]);
      setDisplayArray(null);

    }, [setTreeData, levelOrder]);

    useEffect(() => {
        handleChange();
    }, [avl, handleChange]);

    const delay = useCallback((ms) => new Promise((resolve) => setTimeout(resolve, ms)), []);

    // Visual searching algorithms
    const startSearch = async () => {
      setActive(true);
      switch (type) {
        case 'breadth-first-search':
            await BFS(selectedData[0]);
            break;
        case 'depth-first-search':
          await DFS(selectedData[0]);
          break;
        case 'pre-order-traversal':
            await preOrder();
            break;
        case 'in-order-traversal':
            await inOrder();
            break;
        case 'post-order-traversal':
          await postOrder();
          break;
        default:
            break;
    }
    setActive(false);
    }

    // Helper functions
    const addOrange = (node) => {
      node.classList.remove('border-white');
      node.classList.add('text-orange-600')
      node.classList.add('border-orange-600');
    }

    const removeOrange = (node) =>{
      node.classList.remove('text-orange-600');
      node.classList.remove('border-orange-600');
      node.classList.add('border-white');
    }

    const flashGreen = async (node) => {
      for (let i = 0; i < 3; i++) {
        node.classList.remove('border-white');
        node.classList.add('text-green-600')
        node.classList.add('border-green-600');
        await delay(500);
        node.classList.remove('text-green-600');
        node.classList.remove('border-green-600');
        node.classList.add('border-white');
        await delay(500);
      }

    }

    const BFS = async (target) => {
      if (avlWithKeys.root) {
        const queue = [avlWithKeys.root];
        while (queue.length) {
          const node = queue.shift();
          if (node) {
            const domNode = document.getElementById(`node-${node.key}`);
            addOrange(domNode);
            if (node.value === target) {
              removeOrange(domNode);
              await flashGreen(domNode);
              return
            }
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
            await delay(stepDelay);
            removeOrange(domNode);
          }
        }
      }

    }
    
    const DFS = async (target) => {
      if (avlWithKeys.root) {
        const stack = [avlWithKeys.root];
        while (stack.length) {
          const node = stack.pop();
          if (node) {
            const domNode = document.getElementById(`node-${node.key}`);
            addOrange(domNode);
            if (node.value === target) {
              removeOrange(domNode);
              await flashGreen(domNode);
              return
            }
            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
            await delay(stepDelay);
            removeOrange(domNode);
          }
        }
      }
    }

    const preOrder = async () => {
      if (avlWithKeys.root) {
        const result = [];
        const stack = [avlWithKeys.root];

        while(stack.length) {
          const node = stack.pop();
          if (node) {
            const domNode = document.getElementById(`node-${node.key}`);
            addOrange(domNode)
            result.push(node.value);
            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
            setDisplayArray(JSON.stringify(result).replace(/,/g, ', '))
            await delay(stepDelay);
            removeOrange(domNode);
          }
        }
        return result;
      }
    }

    const inOrder = async () => {
      if (avlWithKeys.root) {
        const result = [];
        const stack = [];
        let current = avlWithKeys.root;
    
        while (stack.length || current) {
          while (current) {
            stack.push(current);
            current = current.left;
          }
          current = stack.pop();
          const domNode = document.getElementById(`node-${current.key}`);
          addOrange(domNode);
          result.push(current.value);
          setDisplayArray(JSON.stringify(result).replace(/,/g, ', '));
          await delay(stepDelay);
          removeOrange(domNode);
          current = current.right;
        }
    
        return result;
      }
    }

    const postOrder = async () => {
      if (avlWithKeys.root) {
        const result = [];
        const stack = [];
        let current = avlWithKeys.root;
        let lastVisited = null;
    
        while (stack.length || current) {
          while (current) {
            stack.push(current);
            current = current.left;
          }
    
          const peekNode = stack[stack.length - 1];
    
          if (peekNode.right && lastVisited !== peekNode.right) {
            current = peekNode.right;
          } else {
            const node = stack.pop();
            const domNode = document.getElementById(`node-${node.key}`);
            addOrange(domNode);
            result.push(node.value);
            setDisplayArray(JSON.stringify(result).replace(/,/g, ', '));
            await delay(stepDelay);
            removeOrange(domNode);
            lastVisited = node;
          }
        }
    
        return result;
      }
    }
  
    return (
        <div className="flex flex-col gap-1 items-end w-full relative">
            {(type  === 'pre-order-traversal' || type === 'in-order-traversal'
            || type === 'post-order-traversal') &&
            <h1 className="text-2xl w-full text-center mb-4 h-8">{displayArray ? `Result: ${displayArray}` : ""}</h1>}
            {(type === "breadth-first-search" || type === "depth-first-search") &&
            <h1 className="text-2xl w-full text-center mb-4 h-8">{`Target: ${selectedData[0]}`}</h1>}
            <div className="w-full max-w-4xl mx-auto p-4 rounded-lg">
                <div className="grid grid-cols-15 grid-rows-5 w-full overflow-visible h-[250px]">
                    {treeData && treeData.map((val, index) => <Node key={index} value={val[0]} n={val[1]} />)}
                </div>
            </div>
            <div className="flex w-full justify-end h-8">
              {(type === "breadth-first-search" || type === "depth-first-search") &&
                <div className="bg-slate-700 rounded-lg shadow-md p-1 px-3">
                  <label htmlFor="setSearchNumber">Target:</label>
                  <input id="setSearchNumber" type="number" value={selectedData[0] || 0} onChange={handleSearchInput} className="bg-slate-700 rounded-md w-12 text-center" />
                </div>}
            </div>
            <div className="flex w-full justify-between flex-wrap">
                <div className="flex flex-row items-center gap-2">
                <button onClick={handleGenerateRandom} className="bg-slate-700 rounded-lg shadow-md p-1 px-3 hover:text-orange-600">Generate</button>
                <button onClick={handleInsert} className={`${arrayLength >=12 ? 'bg-slate-800' : 'bg-slate-700 hover:text-orange-600' } rounded-lg shadow-md p-1 px-3 `}>+</button>
                <button onClick={handlePop} className={`${arrayLength <= 1 ? 'bg-slate-800' : 'bg-slate-700 hover:text-orange-600' } rounded-lg shadow-md p-1 px-3 `}>-</button>
            </div>
            {!active && <button className="bg-orange-600 hover:bg-orange-700 shadow-md rounded-lg p-1 px-6 transition-all duration-750" onClick={startSearch}>Start</button>}
            {active && <button className="bg-slate-700 rounded-lg p-1 px-6 shadow-md">Start</button>}
            
            <select value={type} onChange={active ? () => {} : handleTypeChange}
            className="rounded-lg px-2 bg-slate-700 shadow-md">
                <option value="breadth-first-search">Breadth-first search</option>
                <option value="depth-first-search">Depth-first search</option>
                <option value="pre-order-traversal">Pre-order traversal</option>
                <option value="in-order-traversal">In-order traversal</option>
                <option value="post-order-traversal">Post-order traversal</option>
            </select>
            </div>
        </div>
    );
  };

Tree.propTypes = {
    type: PropTypes.string
}

export default Tree;