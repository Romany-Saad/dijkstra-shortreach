import {inputString} from "./data-1.ts"


let inputLines: string[] = [];
let currentLine: number = 0;

inputLines = inputString.split('\n');
main();

function readLine(): string {
    return inputLines[currentLine++];
}

/*
 * Complete the 'shortestReach' function below.
 *
 * The function is expected to return an INTEGER_ARRAY.
 * The function accepts following parameters:
 *  1. INTEGER n
 *  2. 2D_INTEGER_ARRAY edges
 *  3. INTEGER s
 */
declare type Memo = { [k: number]: IRelativeDistance[] };

function shortestReach(n: number, edges: number[][], s: number): number[] {
    const memo: Memo = {};
    // console.log("=>", `start: ${s} | nodes: ${n} | edges: ${edges.length}`);
    // Write your code here
    const vertixTotalDistance = new Array(n + 1).fill(Infinity);
    let processingList: IRelativeDistance[] = [];
    const processedList: Array<boolean> = new Array(n + 1);
    let processedCount = 0;


    vertixTotalDistance[s] = 0;

    function getNextVertex(): number {
        if (processingList.length === 0) return s;
        const next = processingList.find(dist => processedList[dist.vertex] !== true);
        if (next) return next.vertex;

        return processedList.findIndex(v => v !== true);
    }

    function isProcessed(vertex: number): boolean {
        return processedList[vertex] === true;
    }

    // get the next vertix to start with
    // get neighbors
    // calculate path to neighbors
    // update neighbors
    // repeat
    // if done print in order

    while (processedCount < n) {
        const vertex = getNextVertex();
        const distance = vertixTotalDistance[vertex];

        // console.log("processing", vertex);

        const neighbors = getNeighborsOf(vertex, edges, memo)
            .filter(neighbor => !isProcessed(neighbor.vertex));

        // console.log("neighbors", neighbors);

        neighbors.forEach((neighbor) => {
            const neighborPrevDist = vertixTotalDistance[neighbor.vertex];
            const neighborNewDist = distance + neighbor.distance;
            const shorterDist = Math.min(neighborNewDist, neighborPrevDist);

            // console.log("-- nd-prev", neighborPrevDist);
            // console.log("-- nd-new ", neighborNewDist);
            vertixTotalDistance[neighbor.vertex] = shorterDist;
            neighbor.distance = shorterDist;
        });

        processingList = processingList.filter(i =>
            (neighbors.findIndex(j => i.vertex === j.vertex) < 0)
        );
        processingList.push(...neighbors);
        processingList.sort((a, b) => a.distance - b.distance);
        processedList[vertex] = true;
        processedCount++;

        // console.log("processingList", processingList);
        // console.log("vertixTotalDistance", vertixTotalDistance);

    }


    // removing start item from the code
    vertixTotalDistance.splice(s, 1);
    vertixTotalDistance.splice(0, 1);

    return vertixTotalDistance.map(d => d === Infinity ? -1 : d);
}

interface IRelativeDistance {
    vertex: number;
    distance: number;
}

function getNeighborsOf(vertex: number, edges: number[][], memo: Memo = {}): IRelativeDistance[] {
    if (memo[vertex]) return memo[vertex];

    memo[vertex] = edges
        .filter(edge => edge[0] === vertex || edge[1] === vertex)
        .map(edge => ({
            vertex: edge[0] === vertex ? edge[1] : edge[0],
            distance: edge[2]
        }));

    return memo[vertex];
}


function main() {
    const t: number = parseInt(readLine().trim(), 10);

    for (let tItr: number = 0; tItr < t; tItr++) {
        const firstMultipleInput: string[] = readLine().replace(/\s+$/g, '').split(' ');

        const n: number = parseInt(firstMultipleInput[0], 10);

        const m: number = parseInt(firstMultipleInput[1], 10);

        let edges: number[][] = Array(m);

        for (let i: number = 0; i < m; i++) {
            edges[i] = readLine().replace(/\s+$/g, '').split(' ').map(edgesTemp => parseInt(edgesTemp, 10));
        }

        const s: number = parseInt(readLine().trim(), 10);

        const result: number[] = shortestReach(n, edges, s);

        console.log(
            JSON.stringify(result)
                .replace(']', '')
                .replace('[', '')
                .replace(/,/g, ' ')
        );
    }
}


// 3 6 4 5 5 4 5 4 3 3 4 6 6 4 4 4 4 5 3 4 5 3 4 6 8 4 5 3 4 4 5 4 6 6 2 4 6 4 4 4 4 5 5 3 4 5 3 6 5 4 5 5 4 4 5 3 3 4 2 3 5 2 4 4 3 4 10 5 5 7 4 4 4 1 4 4 4 5 4 4 5 4 4 5 4 5 6 5 4 4 5 5 5 4 4 4 4 3 4 5 3 3 5 4 6 8 2 5 3 4 4 5 3 5 3 3 4 5 3 6 5
// 3 6 4 5 5 4 5 4 4 5 4 6 6 4 4 4 4 5 3 4 5 3 4 6 8 4 5 3 4 4 6 4 6 6 2 4 6 4 4 4 5 5 5 3 4 5 3 6 5 4 5 5 4 4 5 3 3 4 2 3 5 2 4 4 3 4 10 5 6 7 5 4 4 1 4 4 4 5 4 4 5 4 4 5 5 5 6 5 4 4 5 5 5 4 4 4 4 3 4 5 3 3 5 4 6 8 2 5 3 4 4 5 3 5 3 3 4 5 3 6 5


/**
 *
 Software Design: weak
 Databases: medium
 Coding:

 Languages
 * PHP:
 * Node JS:

 Problem solving: good
 Docker: medium
 Business oriented:
 Algorithms & data structures: weak
 Testing:
 */
