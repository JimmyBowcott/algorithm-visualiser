import { useState, useEffect, useCallback } from 'react';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import GridCell from './GridCell';
import PriorityQueue from './PriorityQueue';

const CellType = {
    EMPTY: '',
    START: 'start',
    END: 'end',
    WALL: 'wall',
    VISITED: 'visited',
    PATH: 'path',
    NOT_FOUND: 'notfound',
  };

const GraphVisualiser = ({type='selection'}) => {
    const [active, setActive] = useState(false);
    const navigate = useNavigate();
    const [nRows, setNRows] = useState(11);
    const [nCols, setNCols] = useState(22);
    const [grid, setGrid] = useState([]);
    const [startPos, setStartPos] = useState(null);
    const [endPos, setEndPos] = useState(null);
    const [finished, setFinished] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const stepDelay = 25;

    // Reset the grid
    const resetGrid = useCallback(() => {
        const newGrid = Array.from({ length: nRows }, () => Array.from({ length: nCols }, () => CellType.EMPTY));
        const row = Math.floor(newGrid.length / 2);
        const col = Math.floor(newGrid[0].length / 4);
        newGrid[row][col-2] = CellType.START;
        newGrid[row][nCols-col+1] = CellType.END;
        setStartPos([row,col-2]);
        setEndPos([row, nCols-col+1]);
        setGrid(newGrid);
        setFinished(false);
    }, [nRows, nCols]);

    const resetGridPath = () => {
        const newGrid = [...grid];
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
                if (newGrid[i][j] === CellType.VISITED || newGrid[i][j] === CellType.PATH || newGrid[i][j] === CellType.NOT_FOUND) {
                    newGrid[i][j] = CellType.EMPTY;
                }
            }
        }
        setGrid(newGrid);
        setFinished(false);
    }

    const handleClear = () => {
        if (active) return;
        resetGrid();
    }

    // Set up grid
    useEffect(() => {
        resetGrid()
    }, [nRows, nCols, resetGrid]);

    const delay = useCallback((ms) => new Promise((resolve) => setTimeout(resolve, ms)), []);

    // Change rows and cols
    const incrementGrid = (n) => {
        if (active) return
        if ((nRows + n < 5) || (nRows + n > 25)) return
        setNRows(nRows + 2*n);
        setNCols(nCols + 4*n);
    }
   
    const startSearch = async () => {
        if (finished) resetGridPath()
        setActive(true);
        switch (type) {
            case 'breadth-first-search':
                await bfs();
                break;
            case 'depth-first-search':
                await dfs();
                break;
            case 'a*':
                await aStar();
                break;
            case 'dijkstra':
                await dijkstra();
                break;
            default:
                break;
        }
        setFinished(true);
        setActive(false);
    };

    const handleTypeChange = (e) => {
        navigate(`/graph?type=${e.target.value}`)
    }

    const handleCellClick = (pos) => {
        if (active) return
        if (finished) resetGridPath()
        const newGrid = [...grid];
        const [row, col] = pos;
        if (newGrid[row][col] === CellType.WALL && !isDragging) {
            newGrid[row][col] = CellType.EMPTY;
        } else if (newGrid[row][col] === CellType.EMPTY || (isDragging && !newGrid[row][col] === CellType.START && !newGrid[row][col] === CellType.END)) {
            newGrid[row][col] = CellType.WALL;
        }
        setGrid(newGrid);
    }

    const handleMouseDown = () => {
        setIsMouseDown(true);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        setIsDragging(false);
    };

    const handleMouseMove = (pos) => {
        if (isMouseDown) {
            setIsDragging(true);
            handleCellClick(pos);
        }
    }

    const highlightPath = async (parentMap) => {
        let currentNode = endPos;

        while (currentNode) {
            const [row, col] = currentNode;
            setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            if (newGrid[row][col] !== CellType.START && newGrid[row][col] !== CellType.END) {
                newGrid[row][col] = CellType.PATH;
            }
            return newGrid;
            });
        
            currentNode = parentMap[`${row}-${col}`];
            await delay(stepDelay);
        }
        return
    }

    const triggerNotFound = async () => {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j] === CellType.VISITED) {
                    const newGrid = [...grid];
                    newGrid[i][j] = CellType.NOT_FOUND
                    setGrid(newGrid);
                    await delay(5)
                }
            }
        }
    }

    const bfs = async () => {
        const queue = [startPos];
        const visited = new Set();
        const parentMap = {};
        const directions = [[0, 1],[0, -1],[1, 0],[-1, 0]];
      
        while (queue.length > 0) {
            let [row, col] = queue.shift();
            while (visited.has(`${row}-${col}`)) {
                if (queue.length === 0) {
                    await triggerNotFound();
                    return;
                }
                [row, col] = queue.shift();
            };
            visited.add(`${row}-${col}`);
        
            // Visualise
            setGrid(prevGrid => {
              const newGrid = [...prevGrid];
              if (newGrid[row][col] !== CellType.START && newGrid[row][col] !== CellType.END) {
                newGrid[row][col] = CellType.VISITED;
              }
              return newGrid;
            });
        
            // Check if end
            if (row === endPos[0] && col === endPos[1]) {
              await highlightPath(parentMap);
              return;
            }
        
            // Add to queue
            for (let [dr, dc] of directions) {
              const newRow = row + dr;
              const newCol = col + dc;
        
              if (
                newRow >= 0 &&
                newRow < nRows &&
                newCol >= 0 &&
                newCol < nCols &&
                !visited.has(`${newRow}-${newCol}`) &&
                grid[newRow][newCol] !== CellType.WALL
              ) {
                queue.push([newRow, newCol]);
                parentMap[`${newRow}-${newCol}`] = [row, col];
              }
            }
            await delay(stepDelay)
        }
        await triggerNotFound();
        return
      }

      const dfs = async () => {
        const stack = [startPos];
        const visited = new Set();
        const parentMap = {};
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
        while (stack.length > 0) {
            let [row, col] = stack.pop();
            if (visited.has(`${row}-${col}`)) {
                continue;
            }
            visited.add(`${row}-${col}`);
    
            // Visualise
            setGrid(prevGrid => {
                const newGrid = [...prevGrid];
                if (newGrid[row][col] !== CellType.START && newGrid[row][col] !== CellType.END) {
                    newGrid[row][col] = CellType.VISITED;
                }
                return newGrid;
            });
    
            // Check if end
            if (row === endPos[0] && col === endPos[1]) {
                await highlightPath(parentMap);
                return;
            }
    
            // Add to stack
            for (let [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
    
                if (
                    newRow >= 0 &&
                    newRow < nRows &&
                    newCol >= 0 &&
                    newCol < nCols &&
                    !visited.has(`${newRow}-${newCol}`) &&
                    grid[newRow][newCol] !== CellType.WALL
                ) {
                    stack.push([newRow, newCol]);
                    parentMap[`${newRow}-${newCol}`] = [row, col];
                }
            }
            await delay(stepDelay);
        }
    
        await triggerNotFound();
        return;
    };

    const aStar = async () => {
        const openList = new PriorityQueue();
        const visited = new Set();
        const parentMap = {};
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
        openList.enqueue(startPos, 0);
    
        const gScore = {};
        gScore[`${startPos[0]}-${startPos[1]}`] = 0;
    
        const h = ([row, col]) => Math.abs(row - endPos[0]) + Math.abs(col - endPos[1]);
    
        while (!openList.isEmpty()) {
            const [row, col] = openList.dequeue().element;
    
            if (visited.has(`${row}-${col}`)) {
                continue;
            }
            visited.add(`${row}-${col}`);
    
            // Visualise
            setGrid(prevGrid => {
                const newGrid = [...prevGrid];
                if (newGrid[row][col] !== CellType.START && newGrid[row][col] !== CellType.END) {
                    newGrid[row][col] = CellType.VISITED;
                }
                return newGrid;
            });
    
            // Check if end
            if (row === endPos[0] && col === endPos[1]) {
                await highlightPath(parentMap);
                return;
            }
    
            // Add neighbors to open list
            for (let [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
    
                if (
                    newRow >= 0 &&
                    newRow < nRows &&
                    newCol >= 0 &&
                    newCol < nCols &&
                    grid[newRow][newCol] !== CellType.WALL
                ) {
                    const newGScore = gScore[`${row}-${col}`] + 1;
                    const newFScore = newGScore + h([newRow, newCol]);
    
                    if (!visited.has(`${newRow}-${newCol}`) || newGScore < gScore[`${newRow}-${newCol}`]) {
                        gScore[`${newRow}-${newCol}`] = newGScore;
                        openList.enqueue([newRow, newCol], newFScore);
                        parentMap[`${newRow}-${newCol}`] = [row, col];
                    }
                }
            }
            await delay(stepDelay);
        }
    
        await triggerNotFound();
        return;
    };

    const dijkstra = async () => {
        const openList = new PriorityQueue();
        const visited = new Set();
        const parentMap = {};
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
        openList.enqueue(startPos, 0);
    
        const gScore = {};
        gScore[`${startPos[0]}-${startPos[1]}`] = 0;
    
        while (!openList.isEmpty()) {
            const [row, col] = openList.dequeue().element;
    
            if (visited.has(`${row}-${col}`)) {
                continue;
            }
            visited.add(`${row}-${col}`);
    
            // Visualise
            setGrid(prevGrid => {
                const newGrid = [...prevGrid];
                if (newGrid[row][col] !== CellType.START && newGrid[row][col] !== CellType.END) {
                    newGrid[row][col] = CellType.VISITED;
                }
                return newGrid;
            });
    
            // Check if end
            if (row === endPos[0] && col === endPos[1]) {
                await highlightPath(parentMap);
                return;
            }
    
            // Add neighbors to open list
            for (let [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
    
                if (
                    newRow >= 0 &&
                    newRow < nRows &&
                    newCol >= 0 &&
                    newCol < nCols &&
                    grid[newRow][newCol] !== CellType.WALL
                ) {
                    const newGScore = gScore[`${row}-${col}`] + 1;
    
                    if (!visited.has(`${newRow}-${newCol}`) || newGScore < gScore[`${newRow}-${newCol}`]) {
                        gScore[`${newRow}-${newCol}`] = newGScore;
                        openList.enqueue([newRow, newCol], newGScore);
                        parentMap[`${newRow}-${newCol}`] = [row, col];
                    }
                }
            }
            await delay(stepDelay);
        }
    
        await triggerNotFound();
        return;
    };

    return (
        <>
            {grid.length !== nRows && <div className="w-full h-auto" style={{aspectRatio: '2 / 1'}}></div>}
            {grid.length === nRows &&
            <div className="grid w-full h-auto border border-white"  onDragStart={(e) => e.preventDefault()} onMouseLeave={() => handleMouseUp()}
            style={{gridTemplateRows: `repeat(${nRows}, minmax(0, 1fr))`, gridTemplateColumns: `repeat(${nCols}, minmax(0, 1fr))`}}>
                {grid.map((row, i) => (
                    row.map((cell, j) => (
                        <GridCell key={`${i}-${j}`} type={cell} pos={[i, j]}
                        handleClick={handleCellClick} handleMouseDown={handleMouseDown} handleMouseMove={handleMouseMove} handleMouseUp={handleMouseUp}/>
                    ))
                ))} 
            </div>}
            <div className="flex w-full justify-between flex-wrap">
                <div className="flex flex-row items-center gap-2">
                    <button className="bg-slate-700 rounded-lg shadow-md p-1 px-4 hover:text-orange-600" onClick={() => handleClear()}>Clear grid</button>
                    <button className="bg-slate-700 rounded-lg shadow-md p-1 px-3 hover:text-orange-600" onClick={() => incrementGrid(1)} >+</button>
                    <button className="bg-slate-700 rounded-lg shadow-md p-1 px-3 hover:text-orange-600" onClick={() => incrementGrid(-1)}>-</button>
                </div>
                {!active && <button className="bg-orange-600 hover:bg-orange-700 shadow-md rounded-lg p-1 px-6 transition-all duration-750" onClick={startSearch}>Search</button>}
                {active && <button className="bg-slate-700 rounded-lg p-1 px-6 shadow-md">Search</button>}
                
                <select value={type} onChange={active ? () => {} : handleTypeChange}
                className="rounded-lg px-2 bg-slate-700 shadow-md">
                    <option value="breadth-first-search">Breadth-first search</option>
                    <option value="depth-first-search">Depth-first search</option>
                    <option value="a*">A*</option>
                    <option value="dijkstra">Dijkstra</option>
                </select>
            </div>
        </>

    )
}

GraphVisualiser.propTypes = {
    type: PropTypes.string,
    isPreview: PropTypes.bool,
    isHovered: PropTypes.bool
}

export default GraphVisualiser