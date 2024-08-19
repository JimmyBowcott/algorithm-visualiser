import { useState, useEffect, useCallback } from 'react';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

const SortVisualiser = ({type='selection'}) => {
    const [numItems, setNumItems] = useState(15)
    const [array, setArray] = useState([])
    const [bars, setBars] = useState([])
    const [sorted, setSorted] = useState(false)
    const [active, setActive] = useState(false)
    const stepDelay = 100
    const [barPositions, setBarPositions] = useState({})
    const navigate = useNavigate()

    const generateArray = useCallback(() => {
        const arr = Array.from({ length: numItems }, () => (Math.floor(Math.random() * 95) + 5))
        let bs = []
        let barPos = {}

        for (let i = 0; i < arr.length; i++) {
            const bar = {
                value: arr[i],
                position: i,
                color: 'bg-white'
            }
            barPos[i] = bar.position
            bs.push(bar)
        }
        setArray(arr)
        setBars(bs)
        setBarPositions(barPos)
      }, [numItems]);

    const incrementItems = (n) => {
        if (active) return
        if ((numItems + n < 5) || (numItems + n > 50)) return
        setNumItems(numItems + n)
    }

    const handleTypeChange = (e) => {
        navigate(`/sort?type=${e.target.value}`)
    }

    const shuffleArray = useCallback(() => {
        generateArray()
        setSorted(false)
    }, [generateArray])
    
    const handleShuffle = () => {
        if (!active) shuffleArray()
    }

    useEffect(() => {
        shuffleArray();
    }, [numItems, shuffleArray])

    // Delay for sorting
    const delay = useCallback((ms) => new Promise((resolve) => setTimeout(resolve, ms)), []);
    
    // Sorting functions
    const selectionSort = useCallback(async (arr) => {
        let b = [...bars]
        let bPos = {...barPositions}
        for (let i = 0; i < arr.length; i++) {
            let minIndex = i;
            
            // find min
            for (let j = i + 1; j < arr.length; j++) {
                b[bPos[j]].color = 'bg-orange-600';
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
                setBars([...b]);
                await delay(stepDelay);
                b[bPos[j]].color = 'bg-white';
                
            }

            // highlight grey
            b[bPos[minIndex]].color = 'bg-green-500';
            setBars([...b]);
            await delay(stepDelay*2);

            if (minIndex !== i) {
                // Swap items in arr
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

                // Swap positions in b
                b[bPos[i]].position = minIndex;
                b[bPos[minIndex]].position = i;

                // Swap indices in bPos
                [bPos[i], bPos[minIndex]] = [bPos[minIndex], bPos[i]];

                // Update state
                setBars([...b]);

            }

            await delay(stepDelay);
            setBars([...b]);
        }

        await delay(1000);
        for (let i = 0; i < arr.length; i++) {
            b[i].color = 'bg-white';
        }
        setBars([...b]);
        setBarPositions({ ...bPos });
        setArray([...arr])

        return arr;
    }, [bars, barPositions, delay]);

    const insertionSort = useCallback(async (arr) => {
        let b = [...bars]
        let bPos = {...barPositions}
        b[bPos[0]].color = 'bg-green-500';
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];

            b[bPos[i]].color = 'bg-orange-600';
            setBars([...b]);
            await delay(stepDelay);

            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                // Swap arr
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];

                // Swap b
                [b[bPos[j + 1]].position, b[bPos[j]].position] = [b[bPos[j]].position, b[bPos[j+1]].position];

                // Swap bPos
                [bPos[j + 1], bPos[j]] = [bPos[j], bPos[j + 1]];

                setBars([...b]);
                await delay(stepDelay);

                j = j - 1;
            }

            b[bPos[j+1]].color = 'bg-green-500';
            await delay(stepDelay*3);
            setBars([...b]);
        }
        setBars([...b]);
        setBarPositions({ ...bPos });
        setArray([...arr])
        return arr;
    }, [bars, barPositions, stepDelay, delay]);


    const merge = useCallback(async (arr, start, mid, end) => {
        const b = [...bars];
        let left = arr.slice(start, mid);
        let right = arr.slice(mid, end);
        let i = start;

        // Merge the left and right arrays back into the original array
        while (left.length && right.length) {
            await delay(stepDelay);

            if (left[0] < right[0]) {
                arr[i] = left.shift();
            } else {
                arr[i] = right.shift();
            }
            b[i].color = 'bg-orange-600';
            setBars([...b]);
            i++
        }

        // Copy any remaining elements from left and right arrays
        while (left.length) {
            await delay(stepDelay);
            arr[i] = left.shift();
            b[i].color = 'bg-orange-600';
            setBars([...b]);
            i++
        }

        while (right.length) {
            await delay(stepDelay);
            arr[i] = right.shift();
            b[i].color = 'bg-orange-600';
            setBars([...b]);
            i++
        }

        for (let i = start; i < end; i++) {
            b[i].value = arr[i];
            b[i].color = 'bg-white';
            
        }

        setBars([...b]);
        setArray([...arr]);
    }, [bars, stepDelay, setBars, setArray, delay]);

    const mergeSort = useCallback(async (arr, start = 0, end = arr.length) => {
        if (end - start <= 1) {
            return;
        }

        const mid = Math.floor((start + end) / 2);

        // Recursively sort the left and right halves of the array
        await mergeSort(arr, start, mid);
        await mergeSort(arr, mid, end);

        // Merge the sorted halves back into the original array
        await merge(arr, start, mid, end);
    }, [merge]);

    const quickSort = useCallback(async (arr) => {
        let b = [...bars];
        let bPos = {...barPositions};
      
        const partition = async (arr, low, high) => {
            let pivot = arr[high];
            b[bPos[high]].color = 'bg-orange-600';
            setBars([...b]);
            let i = low - 1;
        
            for (let j = low; j < high; j++) {

                b[bPos[j]].color = 'bg-slate-600';
                b[bPos[i+1]].color = 'bg-slate-600';
                setBars([...b]);
                await delay(stepDelay)
                b[bPos[j]].color = 'bg-white';
                b[bPos[i+1]].color = 'bg-white';
                setBars([...b]);

                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    [b[bPos[i]].position, b[bPos[j]].position] = [b[bPos[j]].position, b[bPos[i]].position];
                    [bPos[i], bPos[j]] = [bPos[j], bPos[i]];

                }
            }

            b[bPos[high]].color = 'bg-green-500';

            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            [b[bPos[i+1]].position, b[bPos[high]].position] = [b[bPos[high]].position, b[bPos[i+1]].position];
            [bPos[i+1], bPos[high]] = [bPos[high], bPos[i+1]];

            setBars([...b]);
            await delay(stepDelay);
            
            return i + 1;
        };
      
        const sort = async (arr, low, high) => {
            if (low < high) {
            let pi = await partition(arr, low, high);
        
            await sort(arr, low, pi - 1);
            await sort(arr, pi + 1, high);
            }
        };
      
        await sort(arr, 0, arr.length - 1);

        for (let i = 0; i < b.length; i++) {
            b[i].color = 'bg-green-500';
        }

        setBars([...b]);
        setBarPositions({...bPos});
        setArray([...arr]);
      }, [stepDelay, setBars, setArray, setBarPositions, bars, barPositions, delay]);

    const startSort = useCallback(async () => {
        setSorted(false);
        setActive(true);
        let bs = [...bars];
        switch (type) {
            case 'selection':
                await selectionSort([...array]);
                break;
            case 'insertion':
                await insertionSort([...array]);
                break;
            case 'merge':
                await mergeSort([...array]);

                // Set to green
                for (let i = 0; i < bs.length; i++) {
                    bs[i].color = 'bg-green-500';
                }
                setBars([...bs]);

                break;
            case 'quick':
                await quickSort([...array]);
                break;
            default:
                await selectionSort([...array]);
                break;
        }

        // Fade color back to white and enable button
        setSorted(true);
        let b = [...bars];
        await delay(1000);
        for (let i = 0; i < b.length; i++) {
            b[i].color = 'bg-white';
        }
        setBars([...b]);
        setActive(false);
    }, [type, array, bars, setSorted, setActive, delay, setBars, selectionSort, insertionSort, mergeSort, quickSort]);

    return (
        <>
            <div className="flex gap-1 items-end h-full w-full relative">
                {Array.isArray(bars) && bars.map((bar, index) => (
                    <div 
                        key={index} 
                        className={`${bar.color} ${sorted ? 'transition-all duration-750' : 'transition-transform duration-500'} ease-out absolute`}
                        style={{
                            height: `${bar.value}%`, 
                            width: `${75 / numItems}%`, 
                            transform: `translateX(${bar.position * 135}%)`
                        }}>
                    </div>
                ))}
            </div>
                <div className="flex w-full justify-between flex-wrap">
                    <div className="flex flex-row items-center gap-2">
                        <button className="bg-slate-700 rounded-lg shadow-md p-1 px-2 hover:text-orange-600" onClick={() => handleShuffle()}>Generate</button>
                        <button className="bg-slate-700 rounded-lg shadow-md p-1 px-3 hover:text-orange-600" onClick={() => incrementItems(1)} >+</button>
                        <button className="bg-slate-700 rounded-lg shadow-md p-1 px-3 hover:text-orange-600" onClick={() => incrementItems(-1)}>-</button>
                    </div>
                    {!active && <button className="bg-orange-600 hover:bg-orange-700 shadow-md rounded-lg p-1 px-6 transition-all duration-750" onClick={() => startSort()}>Sort</button>}
                    {active && <button className="bg-slate-700 rounded-lg p-1 px-6 shadow-md">Sort</button>}
                    
                    <select value={type} onChange={active ? () => {} : handleTypeChange}
                    className="rounded-lg px-2 bg-slate-700 shadow-md">
                        <option value="selection">Selection sort</option>
                        <option value="insertion">Insertion sort</option>
                        <option value="merge">Merge sort</option>
                        <option value="quick">Quick sort</option>
                    </select>
            </div>
        </>

    )
}

SortVisualiser.propTypes = {
    type: PropTypes.string,
    isPreview: PropTypes.bool,
    isHovered: PropTypes.bool
}

export default SortVisualiser