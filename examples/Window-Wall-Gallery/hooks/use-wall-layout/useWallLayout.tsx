import { useEffect, useState } from 'react';

export type Config = {
	maxWidth: number;
	count: number;
};

export interface IUseWallLayoutProps<T> {
	vpWidth: number;
	minWidth: number;
	inputData: T[];
	breakpoints: Config[];
}

export function useWallLayout<T>({
	vpWidth,
	minWidth = 500,
	inputData,
	breakpoints,
}: IUseWallLayoutProps<T>) {
	const [hookReturn, setHookReturn] = useState<{
		outputData: T[][];
	}>({ outputData: [] });

	useEffect(() => {
		if (vpWidth <= 0) return;
		if (!inputData || inputData.length <= 0) return;

		let indexMatch = 0;
		for (let index = breakpoints.length - 1; index >= 0; index--) {
			if (vpWidth >= breakpoints[index]['maxWidth']) indexMatch = index + 1;
		}

		const ratioFirstRow = 2;
		const ratioSecondRow = 1;
		const arrFirstRow = [];
		const arrSecondRow = [];

		const countFirstRow = breakpoints[indexMatch].count;
		const countLastRow = countFirstRow + 1;

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

		const idealRowHeight = Math.max(vpWidth, minWidth) / countFirstRow / 2;

		const arrRatio = arrFirstRow.concat(arrSecondRow);

		let arrRow1: T[] = [];
		let arrRow2: T[] = [];
		const arrReturn: T[][] = [];

		let arrIndex = 0;
		let ratio = 1;
		let isFirstRow = true;

		inputData.map((item, index) => {
			if (index % arrRatio.length == 0) {
				arrIndex = 0;
				isFirstRow = true;
				if (index > 0) {
					arrReturn.push(arrRow1);
					arrReturn.push(arrRow2);
				}
				arrRow1 = [];
				arrRow2 = [];
			}
			ratio = arrRatio[arrIndex];

			if (ratio == 1) {
				isFirstRow = false;
			}

			const modItem = {
				...item,
				ratio,
				width: idealRowHeight * ratio,
				height: idealRowHeight,
			};

			if (isFirstRow) {
				arrRow1.push(modItem);
			} else {
				arrRow2.push(modItem);
			}

			arrIndex++;
		});
		console.log(arrReturn);
		setHookReturn({ outputData: arrReturn });
	}, [vpWidth, inputData, breakpoints, minWidth]);

	return hookReturn;
}

export default useWallLayout;

// if (index % arrRatio.length == 0) {
// 	arrIndex = 0;
// }
// ratio = arrRatio[arrIndex];

// if (index % countFirstRow) {
// 	arr1.push({
// 		...item,
// 		ratio,
// 		width: idealRowHeight * ratio,
// 		height: idealRowHeight,
// 	});
// }

// // arrIndex++;
// // return {
// // 	...item,
// // 	ratio,
// // 	width: idealRowHeight * ratio,
// // 	height: idealRowHeight,
// // };

// const wallinputData = inputData.map((item, index) => {
// 	if (index % arrRatio.length == 0) {
// 		arrIndex = 0;
// 		isFirstRow = true;
// 		if (index > 0) {
// 			arr.push(arr1);
// 			arr.push(arr2);
// 		}
// 		arr1 = [];
// 		arr2 = [];
// 	}
// 	ratio = arrRatio[arrIndex];

// 	if (ratio == 1) {
// 		isFirstRow = false;
// 	}

// 	const modItem = {
// 		...item,
// 		ratio,
// 		width: idealRowHeight * ratio,
// 		height: idealRowHeight,
// 	};

// 	if (isFirstRow) {
// 		arr1.push(modItem);
// 	} else {
// 		arr2.push(modItem);
// 	}

// 	arrIndex++;
// });
