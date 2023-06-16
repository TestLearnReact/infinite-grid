import React, {
	Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

import {
	IInputDataMustContain,
	IOutV,
	IRenderVisibleItemsProps,
	OnScrollEvent,
} from '@module/infinite-grid';
import { IData2 } from '../../../../data';

export interface RefType {
	scrollEvent: (event: OnScrollEvent) => void;
	//testNumber: (n: number) => number;
}

export const MyForm = React.forwardRef(
	<ItemType extends IInputDataMustContain>(
		{ visibleItems, containerStyles }: IRenderVisibleItemsProps<ItemType>,
		ref: Ref<RefType>
	) => {
		//const [state, setState] = useState<IOutV<IData2>>([]);
		const [state, setState] = useState<IOutV<ItemType>>([]);

		const refScollEvent = useRef<OnScrollEvent>({
			currData: { timestamp: 0, x: 0, y: 0 },
			prevData: { timestamp: 0, x: 0, y: 0 },
			scrollSpeed: 0,
		});

		const viewportHeight = containerStyles.outerContainerStyle.height;

		useImperativeHandle(
			ref,
			() => {
				return {
					scrollEvent(e) {
						console.log('child:...', e);
						refScollEvent.current = e;
					},
					// testNumber(n) {
					// 	return n;
					// },
				};
			},
			[]
		);

		useEffect(() => {
			//const vis: IOutV<IData2> = [];
			const vis: IOutV<ItemType> = [];
			const scr = refScollEvent.current.currData.y + viewportHeight / 2;

			visibleItems.map((item) => {
				if (item.offset <= scr) vis.push(item);
			});

			console.log('...', viewportHeight, refScollEvent.current.currData.y, scr);

			setState(vis);
		}, [visibleItems, viewportHeight, refScollEvent.current.currData.y]);

		if (visibleItems.length <= 0) return null;

		return (
			<>
				{state.map((visibleRow, visibleRowIndex) => {
					return (
						/**
						 * visibleRow: {item: Array(10), itemIndex: 0, size: 39.8, offset: 0}
						 * visibleRow: {item: Array(11), itemIndex: 1, size: 39.8, offset: 39.8}
						 *  */
						<RenderVisibleItemsPerRow
							key={visibleRowIndex}
							visibleRowData={visibleRow}
						/>
					);
				})}
			</>
		);
	}
);
MyForm.displayName = 'MyForm';

export const RenderVisibleItems = React.forwardRef<
	RefType,
	IRenderVisibleItemsProps<IData2>
>(
	(
		{ visibleItems, containerStyles },

		ref
	) => {
		const [state, setState] = useState<IOutV<IData2>>([]);

		const refScollEvent = useRef<OnScrollEvent>({
			currData: { timestamp: 0, x: 0, y: 0 },
			prevData: { timestamp: 0, x: 0, y: 0 },
			scrollSpeed: 0,
		});

		const viewportHeight = containerStyles.outerContainerStyle.height;

		useImperativeHandle(
			ref,
			() => {
				return {
					scrollEvent(e) {
						console.log('child:', e);
						refScollEvent.current = e;
					},
					// testNumber(n) {
					// 	return n;
					// },
				};
			},
			[]
		);

		useEffect(() => {
			const vis: IOutV<IData2> = [];
			const scr = refScollEvent.current.currData.y + viewportHeight / 2;

			visibleItems.map((item) => {
				if (item.offset <= scr) vis.push(item);
			});

			console.log('...', viewportHeight, refScollEvent.current.currData.y, scr);

			setState(vis);
		}, [visibleItems, viewportHeight, refScollEvent.current.currData.y]);

		if (visibleItems.length <= 0) return null;

		return (
			<>
				{state.map((visibleRow, visibleRowIndex) => {
					return (
						/**
						 * visibleRow: {item: Array(10), itemIndex: 0, size: 39.8, offset: 0}
						 * visibleRow: {item: Array(11), itemIndex: 1, size: 39.8, offset: 39.8}
						 *  */
						<RenderVisibleItemsPerRow
							key={visibleRowIndex}
							visibleRowData={visibleRow}
						/>
					);
				})}
			</>
		);

		// renderVisibleItems={({
		// 	visibleItems,
		// 	perfectGridData,
		// 	scrollEvent,
		// 	containerStyles,
		// 	refOuterWrapper,
		// 	refInnerWrapper,
		// 	refScollEvent,
		// 	onScroll,
		// 	ref,
		// }) => (
		// 	<RenderVisibleItems
		// 		ref={ref}
		// 		visibleItems={visibleItems}
		// 		perfectGridData={perfectGridData}
		// 		scrollEvent={scrollEvent}
		// 		containerStyles={containerStyles}
		// 		refOuterWrapper={refOuterWrapper}
		// 		onScroll={onScroll}
		// 		refInnerWrapper={refInnerWrapper}
		// 		refScollEvent={refScollEvent}
		// 	/>
		// )}
	}
);
RenderVisibleItems.displayName = 'RenderVisibleItems2';

/**
 *
 */
interface IRenderVisibleItemsPerRow<ItemType extends IInputDataMustContain> {
	/** {item: Array(10), itemIndex: 0, size: 39.8, offset: 0} */
	visibleRowData: IOutV<ItemType>[0];
}

export const RenderVisibleItemsPerRow: React.FC<
	IRenderVisibleItemsPerRow<IData2>
> = ({ visibleRowData }) => {
	if (!visibleRowData.item || visibleRowData.item.length <= 0) return null;

	let left = 0;

	return (
		<>
			{visibleRowData.item.map((outputItem, o) => {
				const Item = (
					<RenderItem
						key={o}
						visibleRowDataItem={outputItem}
						left={left}
						visibleRowData={visibleRowData}
					/>
				);
				left = left + outputItem.width;
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
}

//export const RenderItem: React.FC<IRenderItem<IData2>> = ({
export const RenderItem: React.FC<IRenderItem<IData2>> = ({
	visibleRowDataItem,
	visibleRowData,
	left,
}) => {
	return (
		<div
			key={visibleRowDataItem.id}
			className={`_item${visibleRowDataItem.id}`}
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
