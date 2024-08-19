import ArraysSection from "./sections/ArraysSection"
import TreesSection from "./sections/TreesSection"
import GraphSection from "./sections/GraphSection"

const Homepage = () => {

    return(
        <div className="flex flex-col gap-12 w-full max-w-[950px] mx-auto p-4 mb-8">
            <ArraysSection />
            <TreesSection />
            <GraphSection />
        </div>
    )
}

export default Homepage