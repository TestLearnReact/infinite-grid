import { RefObject } from 'react';

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

export type IPerfectLayoutResponse<
	ItemType,
	O extends HTMLElement = HTMLElement
> = {
	perfectGridData: IPerfectGridData<ItemType>;
	totalHeight: number;
	refVpWrapper: RefObject<O> | null | undefined;
};

export interface IUsePerfectLayoutProps<
	ItemType,
	O extends HTMLElement = HTMLElement
> {
	items: ItemType[];
	refVpWrapper?: RefObject<O> | null | undefined;
	viewportHeight: number;
	viewportWidth: number;
	idealRowHeight?: number | ItemSizeGetter<ItemType>;
	idealRowWidth?: number | ItemSizeGetter<ItemType>;
}
