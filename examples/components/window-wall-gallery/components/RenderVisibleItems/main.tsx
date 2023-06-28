import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import {
	ForwardedRefType,
	IInputDataMustContain,
	IOutV,
	IRenderVisibleItemsProps,
	OnScrollEvent,
} from '@module/infinite-grid';
import { IData2 } from '../../../../data';

import './style.css';

type IRenderData = {
	vStartOnVp: number;
	vEndOnVp: number;
	vEndPrev: number;
	vEndOnVpPrev: number;
	biggestLastEnd: number;
};

export const RenderVisibleItems = React.forwardRef<
	ForwardedRefType,
	IRenderVisibleItemsProps<IData2>
>(
	(
		{ visibleItems, containerStyles },

		ref
	) => {
		const [visibleItemsOnVp, setVisibleItemsOnVp] = useState<IOutV<IData2>>([]);

		const refScollEvent = useRef<OnScrollEvent>({
			currData: { timestamp: 0, x: 0, y: window.scrollY },
			prevData: { timestamp: 0, x: 0, y: -1 },
			scrollSpeed: 0,
		});

		const refRenderData = useRef<IRenderData>({
			vStartOnVp: 0,
			vEndOnVp: 0,
			vEndPrev: 0,
			vEndOnVpPrev: 0,
			biggestLastEnd: 0,
		});

		const viewportHeight = containerStyles.outerContainerStyle.height;
		const scrollForward =
			refScollEvent.current.currData.y > refScollEvent.current.prevData.y;

		const totalSize = containerStyles.innerContainerStyle.totalSize;
		const lastOffset =
			visibleItems[visibleItems.length - 1].offset +
			visibleItems[visibleItems.length - 1].size;

		useImperativeHandle(
			ref,
			() => {
				return {
					scrollEvent(e) {
						refScollEvent.current = e;
					},
				};
			},
			[]
		);

		useEffect(() => {
			const visibleItemsOnScreen: IOutV<IData2> = [];
			const renderUntilScrollOffset =
				refScollEvent.current.currData.y + viewportHeight / 2;

			let vStartOnVp = 0;

			visibleItems.map((item) => {
				if (
					item.offset <= renderUntilScrollOffset ||
					refRenderData.current.biggestLastEnd >= item.itemIndex ||
					totalSize == lastOffset
				) {
					visibleItemsOnScreen.push(item);

					if (item.offset <= refScollEvent.current.currData.y)
						vStartOnVp = item.itemIndex;
				}
			});

			refRenderData.current.vEndOnVpPrev = refRenderData.current.vEndOnVp;

			refRenderData.current.vStartOnVp = vStartOnVp;
			refRenderData.current.vEndOnVp =
				visibleItemsOnScreen[visibleItemsOnScreen.length - 1].itemIndex;

			if (refRenderData.current.vEndOnVp > refRenderData.current.biggestLastEnd)
				refRenderData.current.biggestLastEnd = refRenderData.current.vEndOnVp;

			setVisibleItemsOnVp(visibleItemsOnScreen);
		}, [viewportHeight, visibleItems, scrollForward, totalSize, lastOffset]);

		if (visibleItems.length <= 0 || visibleItemsOnVp.length <= 0) {
			return null;
		}

		console.log('refRenderData.current', refRenderData.current);

		return (
			<>
				{visibleItemsOnVp.map((visibleRow, visibleRowIndex) => {
					return (
						/**
						 * visibleRow: {item: Array(10), itemIndex: 0, size: 39.8, offset: 0}
						 * visibleRow: {item: Array(11), itemIndex: 1, size: 39.8, offset: 39.8}
						 *  */
						<RenderVisibleItemsPerRow
							key={visibleRowIndex}
							visibleRowData={visibleRow}
							renderData={refRenderData.current}
							scrollForward={scrollForward}
						/>
					);
				})}
			</>
		);
	}
);
RenderVisibleItems.displayName = 'RenderVisibleItems';

/**
 *
 */
interface IRenderVisibleItemsPerRow<ItemType extends IInputDataMustContain> {
	/** {item: Array(10), itemIndex: 0, size: 39.8, offset: 0} */
	visibleRowData: IOutV<ItemType>[0];
	renderData: IRenderData;
	scrollForward: boolean;
}

export const RenderVisibleItemsPerRow: React.FC<
	IRenderVisibleItemsPerRow<IData2>
> = ({ visibleRowData, renderData, scrollForward }) => {
	if (!visibleRowData.item || visibleRowData.item.length <= 0) return null;

	let left = 0;
	let count = 0;

	return (
		<>
			{visibleRowData.item.map((outputItem, o) => {
				const Item = (
					<RenderItem
						key={o}
						visibleRowDataItem={outputItem}
						left={left}
						visibleRowData={visibleRowData}
						rowItemCount={o}
						renderData={renderData}
						scrollForward={scrollForward}
					/>
				);
				left = left + outputItem.width;
				count++;
				return Item;
			})}
		</>
	);
};

/**
 *
 */
interface IRenderItem<ItemType extends IInputDataMustContain> {
	visibleRowDataItem: IOutV<ItemType>[0]['item'][0];
	visibleRowData: Omit<IOutV<ItemType>[0], 'item'>;
	left: number;
	rowItemCount: number;
	renderData: IRenderData;
	scrollForward: boolean;
}

export const RenderItem: React.FC<IRenderItem<IData2>> = ({
	visibleRowDataItem,
	visibleRowData,
	left,
	rowItemCount,
	scrollForward,
	renderData,
}) => {
	const [showClass, setShowClass] = useState(
		scrollForward && visibleRowData.itemIndex > renderData.vEndOnVpPrev
			? 'hide'
			: 'showed'
	);

	useEffect(() => {
		const wait = Math.max(
			visibleRowData.itemIndex -
				Math.max(renderData.vStartOnVp, renderData.vEndOnVpPrev),
			0
		);
		const timer = setTimeout(() => {
			setShowClass('showed');
		}, wait * 300 + rowItemCount * 40);

		return () => {
			if (timer !== null) {
				clearTimeout(timer);
			}
		};
	}, [
		rowItemCount,
		renderData.vEndOnVpPrev,
		renderData.vStartOnVp,
		visibleRowData.itemIndex,
	]);

	const className = showClass;

	return (
		<div
			key={visibleRowDataItem.id}
			className={className}
			style={{
				position: 'absolute',
				height: visibleRowDataItem.height,
				width: visibleRowDataItem.width,
				top: visibleRowData.offset,
				left,
				overflow: 'hidden',
			}}
		>
			<div style={{ top: 0, left: 0, fontSize: 7 }}>
				{`${visibleRowData.itemIndex}_${visibleRowDataItem.id}`}
			</div>
		</div>
	);
};
