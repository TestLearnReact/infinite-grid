export interface IInputData {
	id: number;
	src: string;
	width: number;
	height: number;
	ratio: number;
}

const dataWidthHeightRatio: IInputData[] = [];
let item: IInputData;

for (let i = 0; i < 500; i++) {
	item = { id: i, src: `src/img/${i}`, width: 1, height: 1, ratio: 1 };
	dataWidthHeightRatio.push(item);
}
