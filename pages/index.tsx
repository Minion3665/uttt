import type {NextPage} from 'next';
import NoughtsAndCrosses from '../components/NoughtsAndCrosses';
import {useEffect, useState} from 'react';
import Styles from '../styles/Home.module.css';
import useCookie from 'react-use-cookie';

const emptyGame = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

const createGrid = (_: unknown, index: number) => {
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
    };
};

const Home: NextPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [turn, setTurn] = useState('x');
  const [colorblindCookie, setColorblind] = useCookie('colorblindMode', '');
  const [colorblind, setColorblindState] = useState('');

  useEffect(() => {
    setColorblindState(colorblindCookie);
    setLoaded(true);
  }, [loaded, colorblindCookie]);

  const [grid, setGrid] = useState([...Array(3)].map(() => {
    return [...Array(3)].map(createGrid);
  }));

  console.log(grid);

  const getWinner = (grid: string[][]): string | null => {
    for (const row of grid) {
      if (row[0] && row.every((item: string) => item === row[0])) return row[0];
    }
    for (let i = 0; i < grid[0].length; i++) {
      const first = grid[0][i];
      if (!first) continue;
      let success = true;
      for (const row of grid) {
        if (row[i] !== first) {
          success = false;
          break;
        }
      }
      if (success) return first;
    }
    if (grid[0][0] && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) return grid[0][0];
    if (grid[0][2] && grid[0][2] === grid[1][1] && grid[0][2] === grid[2][0]) return grid[0][2];
    return null;
  };

  const gameOver = (grid: string[][]) => {
    return getWinner(grid) || grid.flat().every(cell => cell !== '');
  };

  const functionsForGridIndex = (gridRow: number, gridCol: number) => ({
    onMove: (row: number, col: number) => {
      if (winner) return;
      const newGrid = [...grid];
      console.log({gridRow, gridCol, newGrid});
      if (!newGrid[gridRow][gridCol].playable) return;  // You can't play in a grid where you haven't been 'sent'
      if (newGrid[gridRow][gridCol].winner) return;  // You can't play when there's a winner


      if (newGrid[gridRow][gridCol].grid[row][col]) return;  // You can't play in a space where there's already a piece
      newGrid[gridRow][gridCol].grid[row][col] = turn;
      const finished = gameOver(newGrid[gridRow][gridCol].grid);
      if (finished) newGrid[gridRow][gridCol].winner = getWinner(newGrid[gridRow][gridCol].grid) ?? 'd';

      if (gameOver(newGrid.map(row => row.map(col => col.winner ?? '')))) return setWinner(turn);

      const sendingToFinished = newGrid[row][col].winner !== null;
      for (const [boardRowIndex, boardRow] of newGrid.entries()) {
        for (const [boardColIndex, boardCol] of boardRow.entries()) {
          boardCol.playable = sendingToFinished || boardRowIndex === row && boardColIndex === col;
        }
      }

      setTurn(turn !== 'x' ? 'x' : 'o');
      setGrid(newGrid);
    }
  });

  return (
    <>
      <div className={Styles.section}>
        <div className={Styles.grid + (winner ? ' ' + Styles[winner] : '')}>
          {grid.map((row, rowIndex) => (
            <>
              {row.map(({grid: subgrid, winner: subgridWinner, playable}, colIndex) => {
                const {onMove} = functionsForGridIndex(rowIndex, colIndex);
                return <NoughtsAndCrosses key={rowIndex.toString() + ' ' + colIndex} highlight={!winner && !subgridWinner && playable}  winner={subgridWinner} grid={subgrid} onMove={onMove} colorblind={colorblind} />;
              })}
              <br/>
            </>
          )
          )}
        </div>
        <div className={Styles.sidebar}>
          {winner ? <h1>The game is over; {colorblind ? winner?.toUpperCase() : winner === 'x' ? 'red' : 'blue'} wins!</h1> : <h1>It's {colorblind ? turn?.toUpperCase() : turn === 'x' ? 'red' : 'blue'}'s turn</h1>}
          <a href={'.'} className={Styles.link}>Clear the board</a><br/>
          <a href={'#'} onClick={() => setColorblind(colorblind ? '' : 'enabled')} className={Styles.link}>{colorblind ? 'Disable' : 'Enable'} colorblind mode</a>
          <h1>Game rules</h1>
          <ul>
            <li>There are 9 noughts and crosses grids, arranged in a 3 by 3 square</li>
            <li>To win the game, you need to win 3 of the smaller grids in a row</li>
            <li>You may only play on the grid corresponding to your opponent's last move</li>
            <li>If your opponent moves you to a completed grid, you may play anywhere</li>
          </ul>
        </div>
        <br/>
      </div>
      <div className={Styles.section}>
        <a href="https://bejofo.net/ttt" className={Styles.link}>Not with your friend right now? Play Yannick Rietz&apos;s online version at bejofo.net instead</a>
      </div>
      <div className={Styles.loadingBox + (loaded ? ' ' + Styles.loaded : '')}>Loading...</div>
    </>
  );
};

export default Home;
