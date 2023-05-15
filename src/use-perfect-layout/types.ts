// export type ItemSizeGetter<ItemType> = (item: ItemType) => number;
type ItemSizeGetter<ItemType> = ({
	viewportHeight,
	viewportWidth,
}: //item,
{
	viewportHeight: number;
	viewportWidth: number;
	//item: ItemType;
}) => number;

type IPerfectGridData<ItemType> = Array<
	Array<ItemType & { height: number; width: number }>
>;

export type IPerfectLayoutResponse<ItemType> = {
	perfectGridData: IPerfectGridData<ItemType>;
	totalHeight: number;
};

export interface IUsePerfectLayoutProps<ItemType> {
	items: ItemType[];
	viewportHeight: number;
	viewportWidth: number;
	idealRowHeight?: number | ItemSizeGetter<ItemType>;
	idealRowWidth?: number | ItemSizeGetter<ItemType>;
}
