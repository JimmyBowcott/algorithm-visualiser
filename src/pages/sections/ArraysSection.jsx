import ArrayCard from "../../components/ArrayCard";

const ArraysSection = () => {

    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="text-2xl text-orange-600">Arrays</h1>
            <div className="flex flex-row flex-wrap items-center gap-6">
                <h1 className="-translate-y-5 text-9xl">[</h1>
                <ArrayCard title="Selection sort" index={0} to={'selection'} />
                <ArrayCard title="Insertion sort" index={1} to={'insertion'} />
                <ArrayCard title="Merge sort" index={2} to={'merge'}/>
                <ArrayCard title="Quick sort" index={3} to={'quick'}/>
                <h1 className="-translate-y-5 text-9xl">]</h1>
            </div>
        </div>
    )
}

export default ArraysSection