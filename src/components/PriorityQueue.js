class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    // Helper functions for managing the heap structure
    parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChildIndex(index) {
        return (2 * index) + 1;
    }

    rightChildIndex(index) {
        return (2 * index) + 2;
    }

    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    enqueue(element, priority) {
        // Insert the new element at the end of the heap
        this.heap.push({ element, priority });
        this.bubbleUp();
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parent = this.parentIndex(index);

            if (this.heap[parent].priority <= this.heap[index].priority) break;

            this.swap(parent, index);
            index = parent;
        }
    }

    dequeue() {
        // Remove the element with the highest priority (root of the heap)
        if (this.heap.length === 0) return null;

        const root = this.heap[0];
        const last = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown();
        }

        return root;
    }

    bubbleDown() {
        let index = 0;
        const length = this.heap.length;

        while (true) {
            let left = this.leftChildIndex(index);
            let right = this.rightChildIndex(index);
            let smallest = index;

            if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
                smallest = left;
            }

            if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
                smallest = right;
            }

            if (smallest === index) break;

            this.swap(smallest, index);
            index = smallest;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

export default PriorityQueue