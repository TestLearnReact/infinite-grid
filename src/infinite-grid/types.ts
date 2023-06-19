import {
	IVirtualListHookReturn,
	LoadMoreType,
	OnScrollEvent,
	SkipRenderType,
	VisibleItemDescriptor,
} from '@module/use-virtual-list';
import { IPerfectGridData } from '@module/use-perfect-layout';

import { CSSProperties, Ref } from 'react';

export type IInputDataMustContain = { id: number; ratio: number }; // toto delete id
export type IOutputDataContain = { height: number; width: number }; // toto delete id

export type IOutputVisibleItems<ItemType extends IInputDataMustContain> =
	VisibleItemDescriptor<ItemType & IOutputDataContain>;

// VisibleItemDescriptor<(ItemType & IOutputDataContain)[]>[]
export type IOutV<ItemType extends IInputDataMustContain> = // todo
	VisibleItemDescriptor<(ItemType & IOutputDataContain)[]>[];

export type IGridItemData<ItemType extends IInputDataMustContain> =
	IPerfectGridData<ItemType>[0];

export interface ForwardedRefType {
	scrollEvent: (event: OnScrollEvent) => void;
}

export interface IRenderVisibleItemsProps<
	ItemType extends IInputDataMustContain
> {
	visibleItems: IOutV<ItemType>;
	perfectGridData: IPerfectGridData<ItemType>;
	containerStyles: IVirtualListHookReturn<
		ItemType,
		HTMLElement,
		HTMLElement
	>['containerStyles'];
	refOuterWrapper: React.RefObject<HTMLDivElement>;
	refInnerWrapper: React.RefObject<HTMLDivElement>;
	refForwarded: Ref<ForwardedRefType>;
}
export type IRenderVisibleItems<ItemType extends IInputDataMustContain> = (
	props: IRenderVisibleItemsProps<ItemType>
) => React.ReactNode | undefined;

export interface IInfiniteGridProps<ItemType extends IInputDataMustContain> {
	inputData: ItemType[];
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
