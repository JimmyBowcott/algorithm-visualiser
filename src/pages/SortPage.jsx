import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import SortVisualiser from "../components/SortVisualiser";

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function capitalise(string) {
    if (string) { 
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return 'Selection'
    }
}

const descriptions = {
    'selection': 'Sorts an array by repeatedly finding the minimum element from the unsorted part of the array and swapping it to the beginning of the unsorted part.',
    'insertion': 'This sorting algorithm shifts all the larger elements than the selected item to the right of it until the item is placed in its correct position.',
    'merge': 'Merge sort repeatedly divides an array into halves and then repeatedly combines the halves into sorted arrays until the entire array is sorted.',
    'quick': 'Partitions an array around a pivot (the last element). This is moved into position by swapping lesser elements left and greater elements right.',
}

const SortPage = () => {
    const query = useQuery();
    const location = useLocation();
    const [type, setType] = useState(query.get('type'));
    const navigate = useNavigate();

    useEffect (() => {
        const t = query.get('type');
        if (!descriptions[t]) { navigate('/sort?type=selection') }
        setType(t);
    }, [location.search, query, navigate]); 

    return (
        <div className="flex flex-col gap-2 w-full flex-grow relative">
            <Link to='/' className="absolute top-0 left-12">
                <h1 className="text-lg sm:text-2xl hover:text-orange-600">&larr; Back</h1>
            </Link>
            <div className="flex flex-col items-center gap-4 w-full md:max-w-[1100px] mx-auto p-4">
                <h1 className="text-3xl sm:text-4xl mt-8 sm:m-0">{capitalise(type)} Sort</h1>
                <p className="text-lg mb-4 sm:mb-8">{descriptions[type] || descriptions['selection']}</p>
                <div className="flex flex-col items-center gap-2 w-full h-[500px]">
                    <SortVisualiser type={type}/>
                </div>
            </div>
        </div>
    )
}

export default SortPage