import {
	LoadMoreType,
	OnScrollEvent,
	SkipRenderType,
	VisibleItemDescriptor,
} from '@module/use-virtual-list';
import { IPerfectGridData } from '@module/use-perfect-layout';

import { CSSProperties } from 'react';

export type IInputDataMustContain = { id: number; ratio: number }; // toto delete id
export type IOutputDataContain = { height: number; width: number }; // toto delete id

export type IOutputVisibleItems<ItemType extends IInputDataMustContain> =
	VisibleItemDescriptor<ItemType & IOutputDataContain>;
export type IOutV<ItemType extends IInputDataMustContain> = // todo
	VisibleItemDescriptor<(ItemType & IOutputDataContain)[]>[];

export type IGridItemData<ItemType extends IInputDataMustContain> =
	IPerfectGridData<ItemType>[0];

export type IRenderItemProps<ItemType extends IInputDataMustContain> = {
	index: number;
	gridItemData: IGridItemData<ItemType>; // IPerfectGridData<ItemType>[0];
	offset: number;
	size: number; // test
	items?: any;
	visibleItems?: any;
	scrollForward: boolean;
	rowIndex: number;
	currV: VisibleItemDescriptor<
		(ItemType & {
			height: number;
			width: number;
		})[]
	>[];
	prevV: VisibleItemDescriptor<
		(ItemType & {
			height: number;
			width: number;
		})[]
	>[];
	scrollEvent?: OnScrollEvent;
};

export type IRenderItem<ItemType extends IInputDataMustContain> = ({
	index,
	gridItemData,
	offset,
	size,
	items, //
	visibleItems, //
	currV,
	prevV,
}: IRenderItemProps<ItemType>) => React.ReactNode;

export interface IRenderVisibleItemsProps<
	ItemType extends IInputDataMustContain
> {
	visibleItems: IOutV<ItemType>;
	perfectGridData: any;
	scrollEvent: OnScrollEvent;
}
export type IRenderVisibleItems<ItemType extends IInputDataMustContain> = (
	props: IRenderVisibleItemsProps<ItemType>
) => React.ReactNode;

export interface IInfiniteGridProps<ItemType extends IInputDataMustContain> {
	inputData: ItemType[];
	//renderItem: IRenderItem<ItemType>;
	renderVisibleItems: IRenderVisibleItems<ItemType>;
	/** virtual list props*/
	skipRenderProps: SkipRenderType;
	overscan?: number;
	waitScroll?: number;
	loadMoreProps: LoadMoreType;
	backgroundColor?: CSSProperties['backgroundColor'];
	/** */
	idealRowHeight: number;
}

export { type OnScrollEvent };
