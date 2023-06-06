import { useEffect } from 'react';
import { IData2 } from '../../../../data';

export interface IUseRatioProps<T> {
	width: number;
	height: number;
	data: IData2[];
	options?: RequestInit;
}

function useRatio<T>({ width, height, data, options }: IUseRatioProps<T>) {
	useEffect(() => {
		if (width <= 0) return;
		if (!data || data.length <= 0) return;

		const arrFirstRow = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
		const arrSecondRow = [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1];
		const arrConcat = arrFirstRow.concat(arrSecondRow);

		let arrIndex = 0;
		let ratio = 1;
		const wallData = data.map((item, index) => {
			if (index % arrConcat.length == 0) {
				arrIndex = 0;
			}

			ratio = arrConcat[arrIndex];

			arrIndex++;
			return { ...item, ratio, width: 200, height: 50 };
		});
	}, [width, data]);

	return { dataWithRatio: data };
}

export default useRatio;
