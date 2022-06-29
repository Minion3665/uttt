import type {NextPage} from 'next'
import NoughtsAndCrosses from '../components/NoughtsAndCrosses';
import {useState} from 'react';

const emptyGame = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
]

const createGrid = (_, index: number) => {
    return {
        grid: emptyGame.map(row => [...row]),
        winner: null,
        playable: true,
        index
    } as {
        grid: string[][],
        winner: string | null,
        playable: boolean,
        index: number
    }
}

const Home: NextPage = () => {
    const [winner, setWinner] = useState<string | null>(null);
    const [turn, setTurn] = useState("x");

    const [grid, setGrid] = useState([...Array(3)].map(() => {
        return [...Array(3)].map(createGrid)
    }));

    console.log(grid)

    const gameOver = (grid: string[][]) => {
        for (const row of grid) {
            if (row[0] && row.every((item: string) => item === row[0])) return true;
        }
        for (let i = 0; i < grid[0].length; i++) {
            let first = grid[0][i];
            if (!first) continue
            let success = true;
            for (const row of grid) {
                if (row[i] !== first) {
                    success = false;
                    break
                }
            }
            if (success) return true;
        }
        if (grid[0][0] && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) return true;
        if (grid[0][2] && grid[0][2] === grid[1][1] && grid[0][2] === grid[2][0]) return true;
    }

    const functionsForGridIndex = (gridRow: number, gridCol: number) => ({
        onMove: (row: number, col: number) => {
            if (winner) return
            let newGrid = [...grid];
            console.log({gridRow, gridCol, newGrid})
            newGrid[gridRow][gridCol].grid[row][col] = turn;
            if (gameOver(newGrid[gridRow][gridCol].grid)) newGrid[gridRow][gridCol].winner = turn;

            for (const [boardRowIndex, boardRow] of newGrid.entries()) {
                for (const [boardColIndex, boardCol] of boardRow.entries()) {
                    boardCol.playable = boardRowIndex === row && boardColIndex === col;
                }
            }

            setTurn(turn !== "x" ? "x" : "o")
            setGrid(newGrid)
        }
    })

    return (
        <>
            {grid.map((row, rowIndex) => (
                <>
                    {row.map(({grid: subgrid, winner, playable}, colIndex) => {
                    const {onMove} = functionsForGridIndex(rowIndex, colIndex);
                    // @ts-ignore TODO: Remove this after fixing warning
                    return <NoughtsAndCrosses key={rowIndex.toString() + " " + colIndex} highlight={!winner && playable} grid={subgrid} turn={turn}
                                              onMove={onMove}/>
                    })}
                    <br/>
                    </>
                )
            )}
            {winner}
        </>
    )
}

export default Home
