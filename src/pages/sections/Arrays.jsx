import Card from "../../components/Card";

const Arrays = () => {

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl text-orange-600">Arrays</h1>
            <div className="flex flex-row gap-4">
                <Card title="Selection sort" />
                <Card title="Insertion sort" />
                <Card title="Merge sort" />
                <Card title="Quick sort" />
            </div>
        </div>
    )
}

export default Arrays