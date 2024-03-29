export function PRG(seed) {
    this.seed = seed;
    
    this.next = function() {
        this.seed ^= this.seed << 13;
        this.seed ^= this.seed >> 17;
        this.seed ^= this.seed << 5;
        
        return (this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000 / 1000;
    };
}
export class PriorityQueue {
    constructor(comparator = (a, b) => a < b) {
        this._heap = [];
        this._comparator = comparator;
    }

    size() {
        return this._heap.length;
    }

    peek() {
        return this._heap[0];
    }

    add(value) {
        this._heap.push(value);
        this._siftUp();
    }

    remove() {
        const removedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > 0) {
            this._swap(0, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return removedValue;
    }

    _parent(i) {
        return ((i + 1) >>> 1) - 1;
    }

    _left(i) {
        return (i << 1) + 1;
    }

    _right(i) {
        return (i + 1) << 1;
    }

    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    _siftUp() {
        let node = this.size() - 1;
        while (node > 0 && this._greater(node, this._parent(node))) {
            this._swap(node, this._parent(node));
            node = this._parent(node);
        }
    }

    _siftDown() {
        let node = 0;
        while (
            (this._left(node) < this.size() && this._greater(this._left(node), node)) ||
            (this._right(node) < this.size() && this._greater(this._right(node), node))
        ) {
            let maxChild = (this._right(node) < this.size() && this._greater(this._right(node), this._left(node))) ? this._right(node) : this._left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}
export function createInterpolator(points) {
    // Ensure points are sorted by x values
    points.sort((a, b) => a[0] - b[0]);
    
    return function(x) {
      // Use binary search to find the index of the largest value less than or equal to x
      let low = 0, high = points.length - 1;
      while (low !== high) {
        const mid = Math.floor((low + high + 1) / 2);
        if (points[mid][0] <= x) {
          low = mid;
        } else {
          high = mid - 1;
        }
      }
  
      // Interpolate between the found point and the next point
      const x0 = points[low][0], y0 = points[low][1];
      const x1 = points[low+1][0], y1 = points[low+1][1];
       
      // Linear interpolation formula: y = y0 + ((y1 - y0) * ((x - x0) / (x1 - x0)))
      const y = y0 + ((y1 - y0) * ((x - x0) / (x1 - x0)));
      return y;
    };
  }