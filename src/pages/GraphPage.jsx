import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import GraphVisualiser from "../components/GraphVisualiser";

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function capitalise(string) {
    if (string) return string.charAt(0).toUpperCase() + string.slice(1);
}

function replaceDash(string) {
    if (string) {
    for (let i = string.length; i > 0; i--) {
        if (string[i] === '-') {
            string = string.slice(0, i) + ' ' + string.slice(i + 1);
            return string;
        }
    }
    } else {
        string = 'Breadth-first search'
    }
    return string
}

const descriptions = {
    'breadth-first-search': 'Starts at the root and searches all neighbours for the shortest path to the end node.',
    'depth-first-search': 'Explores as deep as possible before backtracking. Does not guarantee the shortest path.',
    'a*': 'Uses a heuristic approach as well as a priority queue to explore nodes with the lowest cost first.',
    'dijkstra': 'Finds the shortest path to the end node by exploring nodes with the lowest cumulative cost.'
};

const GraphPage = () => {
    const query = useQuery();
    const location = useLocation();
    const [type, setType] = useState(query.get('type'));
    const title = replaceDash(capitalise(type))
    const navigate = useNavigate();
    const [tip, setTip] = useState(true);
    const [tipHovered , setTipHovered] = useState(false);

    useEffect (() => {
        const t = query.get('type');
        if (!descriptions[t]) { navigate('/graph?type=breadth-first-search') }
        setType(t);
    }, [location.search, query, navigate]);

    const handleTipEnter = () => {
        setTipHovered(true);
    }

    const handleTipLeave = () => {  
        setTipHovered(false);
    }

    return (
        <div className="flex flex-col gap-2 w-full flex-grow relative">
            <Link to='/' className="absolute -top-4 left-12">
                <h1 className="text-lg sm:text-2xl hover:text-orange-600">&larr; Back</h1>
            </Link>
            <div className="flex flex-col items-center gap-4 w-full md:max-w-[1100px] mx-auto p-4">
                <h1 className="text-3xl sm:text-4xl mt-8 sm:m-0">{title}</h1>
                <p className="text-lg">{descriptions[type] || descriptions['selection']}</p>
                { tip && 
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-lg">Tip: <span className="text-orange-600">Click or drag the squares</span> to add a wall!</p>
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer" onClick={() => setTip(false)} onMouseEnter={() => handleTipEnter()} onMouseLeave={() => handleTipLeave()}>
                        <path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" className={`${tipHovered ? 'stroke-orange-600' : 'stroke-slate-300'} stroke-2`} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                }
                <div className="flex flex-col items-center gap-2 w-full mt-2">
                    <GraphVisualiser type={type} />
                </div>
            </div>
        </div>
    )
}

export default GraphPage