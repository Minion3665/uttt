import type {NextPage} from 'next'
import NoughtsAndCrosses from '../components/NoughtsAndCrosses';
import {useState} from 'react';
import Styles from '../styles/Home.module.css';

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
            if (!newGrid[gridRow][gridCol].playable) return;  // You can't play in a grid where you haven't been 'sent'
            if (newGrid[gridRow][gridCol].winner) return;  // You can't play when there's a winner


	    if (newGrid[gridRow][gridCol].grid[row][col]) return;  // You can't play in a space where there's already a piece
            newGrid[gridRow][gridCol].grid[row][col] = turn;
            const finished = gameOver(newGrid[gridRow][gridCol].grid);
            if (finished) newGrid[gridRow][gridCol].winner = turn;

            if (gameOver(newGrid.map(row => row.map(col => col.winner ?? '')))) return setWinner(turn);

            const sendingToFinished = newGrid[row][col].winner !== null;
            for (const [boardRowIndex, boardRow] of newGrid.entries()) {
                for (const [boardColIndex, boardCol] of boardRow.entries()) {
                    boardCol.playable = sendingToFinished || boardRowIndex === row && boardColIndex === col;
                }
            }

            setTurn(turn !== "x" ? "x" : "o")
            setGrid(newGrid)
        }
    })

    return (
	<>
        <div className={Styles.grid + (winner ? " " + Styles[winner] : "")}>
            {grid.map((row, rowIndex) => (
                <>
                    {row.map(({grid: subgrid, winner: subgridWinner, playable}, colIndex) => {
                    const {onMove} = functionsForGridIndex(rowIndex, colIndex);
                    // @ts-ignore TODO: Remove this after fixing warning
                    return <NoughtsAndCrosses key={rowIndex.toString() + " " + colIndex} highlight={!winner && !subgridWinner && playable}  winner={subgridWinner} grid={subgrid} turn={turn}
                                              onMove={onMove}/>
                    })}
                    <br/>
                    </>
                )
            )}
        </div>
	<div className={Styles.sidebar}>
	    {winner ? <h1>The game is over; {winner === 'x' ? 'red' : 'blue'} wins!</h1> : <h1>It's {turn === 'x' ? 'red' : 'blue'}'s turn</h1>}
	    <a href="." className={Styles.link}>Clear the board</a>
	</div>
	<br/>
	    <a href="https://bejofo.net/ttt" className={Styles.link}>Not with your friend right now? Play Yannick Rietz&apos;s online version at bejofo.net instead</a>
	</>
    )
}

export default Home
