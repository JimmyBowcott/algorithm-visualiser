import GraphCard from "../../components/GraphCard";

const GraphSection = () => {

    return (
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-2xl text-orange-600">Graph</h1>
            <div className="flex flex-row flex-wrap items-center ml-4">
                <GraphCard title={"Breadth-first search"} to={'breadth-first-search'}/>
                <GraphCard title={"Depth-first search"} to={'depth-first-search'}/>
            </div>
        </div>
    )
}

export default GraphSection