export interface TOptions<ItemType> {
	margin: number;
	idealRowHeight?: number | ItemSizeGetter<ItemType>;
	idealRowWidth?: number | ItemSizeGetter<ItemType>;
}

// export type ItemSizeGetter<ItemType> = (item: ItemType) => number;
export type ItemSizeGetter<ItemType> = ({
	viewportHeight,
	viewportWidth,
}: //item,
{
	viewportHeight: number;
	viewportWidth: number;
	//item: ItemType;
}) => number;
