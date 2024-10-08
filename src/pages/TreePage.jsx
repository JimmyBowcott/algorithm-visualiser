import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import Tree from "../components/Tree";

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
    'breadth-first-search': 'Searches the tree level by level, left to right for a target value.',
    'depth-first-search': 'Searches the tree depth first, left to right for the specified value.',
    'pre-order-traversal': 'Traverses the tree by visiting the root node, then left, then right.',
    'in-order-traversal': 'Traverses the tree by visiting the left node, then root, then right.',
    'post-order-traversal': 'Traverses the tree by visiting the left node, then right, then root.',
  }

const TreePage = () => {
    const query = useQuery();
    const location = useLocation();
    const [type, setType] = useState(query.get('type'));
    const title = replaceDash(capitalise(type))
    const navigate = useNavigate();

    useEffect (() => {
        const t = query.get('type');
        if (!descriptions[t]) { navigate('/tree?type=breadth-first-search') }
        setType(t);
    }, [location.search, query, navigate]);

    return (
        <div className="flex flex-col gap-2 w-full flex-grow relative">
            <Link to='/' className="absolute top-0 left-12">
                <h1 className="text-lg sm:text-2xl hover:text-orange-600">&larr; Back</h1>
            </Link>
            <div className="flex flex-col items-center gap-4 w-full md:max-w-[1100px] mx-auto p-4">
                <h1 className="text-3xl sm:text-4xl mt-8 sm:m-0">{title}</h1>
                <p className="text-lg">{descriptions[type] || descriptions['selection']}</p>
                <div className="flex flex-col items-center gap-2 w-full mt-2 sm:mt-6 md:mt-12">
                    <Tree type={type} />
                </div>
            </div>
        </div>
    )
}

export default TreePage