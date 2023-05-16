type ItemSizeGetter = ({
	viewportHeight,
	viewportWidth,
}: {
	viewportHeight: number;
	viewportWidth: number;
}) => number;

type IOptions = {
	margin: number;
	idealRowHeight?: number | ItemSizeGetter;
	idealRowWidth?: number | ItemSizeGetter;
};

export type IRequiredInputDataProps = { ratio: number };

export interface IPerfectLayoutProps<ItemType> {
	inputData: ItemType[];
	viewportWidth: number;
	viewportHeight: number;
	opts?: IOptions;
	idealRowHeight?: number;
	useNextToLastPartitionsForLastRow?: boolean;
	optimizeLastRow?: { optimize: boolean; avgLastRowCount: number };
}
