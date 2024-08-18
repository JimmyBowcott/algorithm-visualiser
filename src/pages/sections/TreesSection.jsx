import { useState } from 'react';
import TreeCard from "../../components/TreeCard";

const TreesSection = () => {
    const [nHovered, setNHovered] = useState(-1);

    const highlightN = (n) => {
        setNHovered(n);
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="text-2xl text-orange-600">Trees</h1>
            <div className="flex flex-row flex-wrap items-center">
                <TreeCard title="Breadth-first search"
                index={0} highlightN={highlightN} nHovered={nHovered} line={true}
                to={'breadth-first-search'} />
                <TreeCard title="Depth-first search"
                index={1} highlightN={highlightN} nHovered={nHovered} line={true}
                to={'depth-first-search'} />
                <TreeCard title="Pre-order traversal"
                index={2} highlightN={highlightN} nHovered={nHovered}  line={true}
                to={'pre-order-traversal'} />
                <TreeCard title="In-order traversal"
                index={3} highlightN={highlightN} nHovered={nHovered} line={true}
                to={'in-order-traversal'} />
                <TreeCard title="Post-order traversal"
                index={4} highlightN={highlightN} nHovered={nHovered} 
                to={'post-order-traversal'} />
            </div>
        </div>
    )
}

export default TreesSection