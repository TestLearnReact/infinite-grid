import BreakpointPartition from './utils';
import { TOptions } from './types';
import { IPerfectLayoutResponse } from '../types';

type TRequiredInputDataProps = { ratio: number };

export interface IPerfectLayoutProps<ItemType> {
	inputData: ItemType[];
	viewportWidth: number;
	viewportHeight: number;
	opts?: TOptions<ItemType>;
	idealRowHeight?: number;
	useNextToLastPartitionsForLastRow?: boolean;
	optimizeLastRow?: { optimize: boolean; avgLastRowCount: number };
}

export function perfectLayout<ItemType extends TRequiredInputDataProps>({
	inputData,
	viewportWidth,
	viewportHeight,
	opts = { margin: 0 },
	idealRowHeight,
	useNextToLastPartitionsForLastRow = false,
	optimizeLastRow = { optimize: false, avgLastRowCount: 1 },
}: IPerfectLayoutProps<ItemType>): IPerfectLayoutResponse<ItemType> {
	if (viewportHeight <= 0 || viewportWidth <= 0 || inputData.length <= 0)
		return { perfectGridData: [], totalHeight: 0 }; //todo

	console.log(
		'->>>>>>> perfectLayout: <<<<<<<-',
		viewportHeight,
		viewportWidth
	);

	const idealHeight = idealRowHeight || viewportHeight / 2;

	let totalHeight = 0;

	const perfectRowCount = _perfectRowsNumber<ItemType>({
		inputData,
		viewportWidth: viewportWidth,
		idealHeight,
	});

	if (perfectRowCount < 1) {
		totalHeight = idealHeight; // todo test

		const perfectGridData = inputData.map((img) => {
			return [
				{
					...img,
					width: idealHeight * img.ratio - opts.margin * 2,
					height: idealHeight,
				},
			];
		});

		return { perfectGridData, totalHeight };
	} else {
		const weights = inputData.map((img) => img.ratio * 100);
		const partitions = BreakpointPartition({
			imageRatioSequence: weights,
			expectedRowCount: perfectRowCount,
		});

		let currItemIndex = 0;
		let lastRowHeight = 0;

		const perfectGridData = partitions.map((row, rowIndex) => {
			const summedRatios = row.reduce(
				(sum, el, i) => sum + inputData[currItemIndex + i].ratio,
				0
			);

			lastRowHeight = viewportWidth / summedRatios;
			totalHeight += lastRowHeight;

			const returnData = row.map(() => {
				const img = inputData[currItemIndex++];

				return {
					...img,
					width: lastRowHeight * img.ratio - opts.margin * 2,
					height: lastRowHeight,
				};
			});

			return returnData;
		});

		// recalculate/resize last row
		if (optimizeLastRow.optimize && optimizeLastRow.avgLastRowCount > 0) {
			let rowCount = 0;
			let summedPartitionRatios = 0;
			let avgRatios = 0;
			const rowStart = Math.max(
				partitions.length - (optimizeLastRow.avgLastRowCount + 1),
				0
			);
			const rowStop = partitions.length - 2;
			let height = 0;

			if (rowStart < rowStop) {
				// calculate row/-s ratio average
				for (let index = rowStart; index <= rowStop; index++) {
					rowCount += 1;

					summedPartitionRatios += partitions[index].reduce(
						(sum, el, i) => sum + inputData[index + i].ratio,
						0
					);
				}

				if (rowCount > 0 && summedPartitionRatios > 0) {
					avgRatios = summedPartitionRatios / rowCount;
					height = viewportWidth / avgRatios;

					const lastRow = perfectGridData[perfectGridData.length - 1];
					const newLastRow = lastRow.map((lastItem) => {
						return {
							...lastItem,
							width: height * lastItem.ratio - opts.margin * 2,
							height,
						};
					});

					perfectGridData[perfectGridData.length - 1] = newLastRow;

					totalHeight = totalHeight - lastRowHeight + height;
				}
			}
		}

		return { perfectGridData, totalHeight };
	}
}

export default perfectLayout;

function _perfectRowsNumber<ItemType extends { ratio: number }>({
	inputData,
	viewportWidth,
	idealHeight,
}: {
	inputData: ItemType[];
	viewportWidth: number;
	idealHeight: number;
}) {
	const totalWidth = inputData.reduce(
		(sum, img) => sum + img.ratio * idealHeight,
		0
	);

	return Math.round(totalWidth / viewportWidth);
}
