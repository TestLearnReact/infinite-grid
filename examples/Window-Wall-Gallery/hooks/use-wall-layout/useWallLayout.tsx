import { useEffect, useState } from 'react';

export interface IUseWallLayoutProps<T> {
	width: number;
	height: number;
	data: T[];
	options?: RequestInit;
}

export function useWallLayout<T>({
	width,
	height,
	data,
	options,
}: IUseWallLayoutProps<T>) {
	const [hookReturn, setHookReturn] = useState<{
		data: T[];
		idealRowHeight: number;
	}>({ data: [], idealRowHeight: 0 });

	useEffect(() => {
		if (width <= 0) return;
		if (!data || data.length <= 0) return;

		const ratioFirstRow = 2;
		const ratioSecondRow = 1;
		const arrFirstRow = [];
		const arrSecondRow = [];

		let countFirstRow = 0;
		let countLastRow = 0;

		let idealRowHeight = 0;

		if (width < 800) {
			countFirstRow = 10;
			//idealRowHeight = width / 2 / countFirstRow + 1;
		} else if (width < 1000) {
			countFirstRow = 20;
			//idealRowHeight = width / 2 / countFirstRow + 1;
		} else if (width < 1400) {
			countFirstRow = 30;
			//idealRowHeight = width / 2 / countFirstRow + 1;
		} else if (width < 2000) {
			countFirstRow = 40;
			//idealRowHeight = width / 2 / countFirstRow + 1;
		}
		countLastRow = countFirstRow + 1;
		//idealRowHeight = width / 2 / countFirstRow + 1;

		idealRowHeight = (width + countFirstRow) / 2 / countFirstRow;

		// idealRowHeight = Math.round(width / 30 / 2) + 1;

		//idealRowHeight = idealRowHeight - countFirstRow;

		for (let index = 0; index < countFirstRow; index++) {
			arrFirstRow.push(ratioFirstRow);
		}
		for (let index = 0; index < countLastRow; index++) {
			if (index == 0 || index == countLastRow - 1) {
				arrSecondRow.push(ratioSecondRow);
			} else {
				arrSecondRow.push(ratioFirstRow);
			}
		}

		const arrRatiot = arrFirstRow.concat(arrSecondRow);

		console.log(
			'idealRowHeight',

			idealRowHeight,
			idealRowHeight * 2,
			width
		);

		let arrIndex = 0;
		let ratio = 1;
		const wallData = data.map((item, index) => {
			if (index % arrRatiot.length == 0) {
				arrIndex = 0;
			}

			ratio = arrRatiot[arrIndex];

			arrIndex++;
			return { ...item, ratio, width: 200, height: 50 };
		});

		setHookReturn({ data: wallData, idealRowHeight });
	}, [width, data]);

	return hookReturn;
}

export default useWallLayout;
