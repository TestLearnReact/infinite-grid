import { RefObject } from 'react';

export type TViewportRect = Pick<DOMRect, 'width' | 'height'>;

type IPerfectRowSizeGetter = ({
	viewportHeight,
	viewportWidth,
}: {
	viewportHeight: number;
	viewportWidth: number;
}) => number;

type IOutputDataContain = { height: number; width: number };

export type IPerfectGridData<ItemType> = Array<
	Array<ItemType & IOutputDataContain>
>;

export type IPerfectLayoutHookResponse<
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
	idealRowHeight?: number | IPerfectRowSizeGetter;
}
