import type { NextPage } from 'next'
import Styles from '../styles/NoughtsAndCrosses.module.css';

const NoughtsAndCrosses: NextPage = (props) => {
	const { winner, highlight, turn, onMove, grid, colorblind } = props;

		const makeMove = (space) => {
		const height = grid.length;
		if (!height) throw new Error("Grid is empty");
		const width = grid[0].length;

		const row = Math.floor(space/3)
		const col = space % 3

		onMove(row, col);
	};
	return (
		<table className={Styles.grid + (winner ? " " + Styles[winner] : "") + (colorblind ? " " + Styles.colorblind : "")}><tbody>
		{
			grid.map((row, rowindex) => <tr key={rowindex}>{
				row.map((cell, cellindex) => <td key={cellindex} className={Styles.cell + (highlight ? " " + Styles.highlight : "") + (cell ? " " + Styles[cell] : "")} onClick={() => makeMove(rowindex * 3 + cellindex)}>{colorblind ? cell : null}</td>)
			}
			</tr>)
		}
		</tbody></table>
	);
};
export default NoughtsAndCrosses;
