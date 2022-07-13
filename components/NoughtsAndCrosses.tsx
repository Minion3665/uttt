import type { NextPage } from 'next';
import Styles from '../styles/NoughtsAndCrosses.module.css';

interface NoughtsAndCrossesProps {
  winner: string;
  highlight: boolean;
  onMove: (row: number, col: number) => void;
  colorblind: string;
  grid: string[][];
}

const NoughtsAndCrosses: NextPage<NoughtsAndCrossesProps> = (props) => {
  const { winner, highlight, onMove, grid, colorblind } = props;

  const makeMove = (space: number) => {
    const height = grid.length;
    if (!height) throw new Error('Grid is empty');

    const row = Math.floor(space/3);
    const col = space % 3;

    onMove(row, col);
  };
  return (
    <table className={Styles.grid + (winner ? ' ' + Styles[winner] : '') + (colorblind ? ' ' + Styles.colorblind : '')}><tbody>
      {
        grid.map((row, rowindex) => <tr key={rowindex}>{
          row.map((cell, cellindex) => <td key={cellindex} className={Styles.cell + (highlight ? ' ' + Styles.highlight : '') + ' ' + (cell ? Styles[cell] : Styles.empty)} onClick={() => makeMove(rowindex * 3 + cellindex)}>{colorblind ? cell || (highlight ? '-' : ''): null}</td>)
        }
        </tr>)
      }
    </tbody></table>
  );
};
export default NoughtsAndCrosses;
