import { LoadMoreType, SkipRenderType } from '@module/use-virtual-list';
import { IPerfectGridData } from '@module/use-perfect-layout';

import { CSSProperties } from 'react';

export type IInputDataMustContain = { id: number; ratio: number }; // toto delete id

export type IGridItemData<ItemType extends IInputDataMustContain> =
	IPerfectGridData<ItemType>[0];

export type IRenderItemProps<ItemType extends IInputDataMustContain> = {
	index: number;
	gridItemData: IGridItemData<ItemType>; // IPerfectGridData<ItemType>[0];
	offset: number;
	size: number; // test
};

export type IRenderItem<ItemType extends IInputDataMustContain> = ({
	index,
	gridItemData,
	offset,
	size,
}: IRenderItemProps<ItemType>) => React.ReactNode;

export interface IInfiniteGridProps<ItemType extends IInputDataMustContain> {
	inputData: ItemType[];
	renderItem: IRenderItem<ItemType>;
	/** virtual list props*/
	skipRenderProps: SkipRenderType;
	overscan?: number;
	waitScroll?: number;
	loadMoreProps: LoadMoreType;
	backgroundColor?: CSSProperties['backgroundColor'];
}
