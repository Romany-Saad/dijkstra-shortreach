import {inputString} from "./input-7.ts"


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
interface IRelativeDistance {
    vertex: number;
    distance: number;
}

declare type NeighborsGraph = { [k: number]: number[] };

function shortestReach(n: number, edges: number[][], s: number): number[] {
    const neighborsGraph: NeighborsGraph = buildNeighborsGraph(edges);
    const vertexTotalDistance = new Array(n + 1).fill(Infinity);
    let processingList: IRelativeDistance[] = [];
    const processedList: Array<boolean> = new Array(n + 1);
    let processedCount = 0;


    vertexTotalDistance[s] = 0;

    function getNextVertex(): number {
        if (processingList.length === 0) return s;
        const next = processingList.find(p => processedList[p.vertex] !== true);
        if (next) return next.vertex;

        return processedList.findIndex(not(isProcessed));
    }

    function not(predicate: (...args: any[]) => boolean): (...args: any[]) => boolean {
        return (...args: any[]) => !predicate(...args)
    }

    function isProcessed(vertex: number): boolean {
        return processedList[vertex] === true;
    }

    // get the next vertex to start with
    // get neighbors
    // calculate path to neighbors
    // update neighbors
    // repeat
    // if done print in order

    while (processedCount < n) {
        const vertex = getNextVertex();
        const distance = vertexTotalDistance[vertex];


        const neighbors = getNeighborsOf(vertex, edges, neighborsGraph)
            .filter(neighbor => !isProcessed(neighbor.vertex));

        neighbors.forEach((neighbor) => {
            const neighborPrevDist = vertexTotalDistance[neighbor.vertex];
            const neighborNewDist = distance + neighbor.distance;
            const shorterDist = Math.min(neighborNewDist, neighborPrevDist);
            vertexTotalDistance[neighbor.vertex] = shorterDist;
            neighbor.distance = shorterDist;
        });

        processingList = processingList.concat(neighbors);
        processingList.sort((a, b) => a.distance - b.distance);
        processedList[vertex] = true;
        processedCount++;
    }

    // removing start item from the code
    vertexTotalDistance.splice(s, 1);
    vertexTotalDistance.splice(0, 1);

    return vertexTotalDistance.map(d => d === Infinity ? -1 : d);
}

function buildNeighborsGraph(edges: number[][]) {
    const x: { [k: number]: number[] } = {};

    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];

        if (!x[edge[0]]) x[edge[0]] = [];
        if (!x[edge[1]]) x[edge[1]] = [];

        x[edge[0]].push(i);
        x[edge[1]].push(i);
    }

    return x;
}

function getNeighborsOf(vertex: number, edges: number[][], neighborsGraph: NeighborsGraph = {}): IRelativeDistance[] {

    const filteredEdges = neighborsGraph[vertex];

    return filteredEdges ? filteredEdges.map(edgeIndex => ({
        vertex: edges[edgeIndex][0] === vertex ? edges[edgeIndex][1] : edges[edgeIndex][0],
        distance: edges[edgeIndex][2]
    })) : [];
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