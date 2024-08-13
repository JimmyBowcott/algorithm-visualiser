import Card from "../../components/Card";

const Trees = () => {

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl text-orange-600">Trees</h1>
            <div className="flex flex-row gap-4">
                <Card title="Breadth-first search" />
                <Card title="Depth-first search" />
                <Card title="Pre-order traversal" />
                <Card title="In-order traversal" />
                <Card title="Post-order traversal" />
            </div>
        </div>
    )
}

export default Trees