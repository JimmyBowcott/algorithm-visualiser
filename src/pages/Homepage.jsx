import ArraysSection from "./sections/ArraysSection"
import TreesSection from "./sections/TreesSection"

const Homepage = () => {

    return(
        <div className="flex flex-col gap-16 w-full max-w-[950px] mx-auto p-4 mb-12">
            <ArraysSection />
            <TreesSection />
        </div>
    )
}

export default Homepage