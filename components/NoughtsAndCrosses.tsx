import type { NextPage } from 'next'
import Styles from '../styles/NoughtsAndCrosses.module.css';

const NoughtsAndCrosses: NextPage = (props) => {
	const { highlight, turn, onMove, grid } = props;

		const makeMove = (space) => {
		const height = grid.length;
		if (!height) throw new Error("Grid is empty");
		const width = grid[0].length;

		const row = Math.floor(space/3)
		const col = space % 3

		onMove(row, col);
	};
	return (
		<table className={Styles.grid}><tbody>
		{
			grid.map((row, rowindex) => <tr key={rowindex}>{
				row.map((cell, cellindex) => <td key={cellindex} className={Styles.cell + (highlight ? " " + Styles.highlight : "")} onClick={() => makeMove(rowindex * 3 + cellindex)}>{cell || " "}</td>)
			}
			</tr>)
		}
		</tbody></table>
	);
};
export default NoughtsAndCrosses;
