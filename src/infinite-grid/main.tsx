import React, { useRef, useState } from 'react';
import { IInfiniteGridProps, IInputDataMustContain } from './types';
import { OnScrollEvent, useVirtualList } from '@module/use-virtual-list';
import usePerfectLayout, { IPerfectGridData } from '@module/use-perfect-layout';

export default function InfiniteGrid<ItemType extends IInputDataMustContain>(
	props: React.PropsWithChildren<IInfiniteGridProps<ItemType>>
) {
	const refOuterWrapper = useRef<HTMLDivElement>(null);
	const refInnerWrapper = useRef<HTMLDivElement>(null);

	const refSpeedBigger = useRef<boolean>(false);
	const refScollEvent = useRef<OnScrollEvent>({
		currData: { timestamp: 0, x: 0, y: 1 },
		prevData: { timestamp: 0, x: 0, y: 0 },
		scrollSpeed: 0,
	});

	const [_, setSpeed] = useState<number>(0);

	const {
		inputData,
		renderVisibleItems,
		overscan = 3,
		skipRenderProps = { scrollSpeedSkip: 12, waitRender: 400 },
		waitScroll = 40,
		loadMoreProps = {
			isItemLoaded(index) {
				return false;
			},
			async loadMore(event) {
				return { hasFetchedMore: true };
			},
			loadMoreCount: 20,
		},
		backgroundColor = 'beige', // todo css class?
		idealRowHeight,
	} = props;

	const { perfectGridData, totalHeight } = usePerfectLayout<
		ItemType,
		HTMLDivElement
	>({
		items: inputData,
		refVpWrapper: refOuterWrapper,
		idealRowHeight, //: ({ viewportHeight, viewportWidth }) => 40, //viewportWidth / 10,
	});

	const { visibleItems, containerStyles, isFetching, msDataRef } =
		useVirtualList<
			IPerfectGridData<ItemType>[0], //ItemType,
			HTMLDivElement,
			HTMLDivElement
		>({
			xouterRef: refOuterWrapper,
			xinnerRef: refInnerWrapper,
			itemSize: (item) => {
				return item[0].height;
			},
			listDirection: 0,
			overscan,
			useWindowScroll: true,
			items: perfectGridData, //inputData,
			onScroll: (e) => {
				refScollEvent.current = e;
				if (
					e.scrollSpeed > skipRenderProps.scrollSpeedSkip &&
					!refSpeedBigger.current
				) {
					refSpeedBigger.current = true;
					setSpeed(e.scrollSpeed);
				}
				if (
					e.scrollSpeed <= skipRenderProps.scrollSpeedSkip &&
					refSpeedBigger.current
				) {
					refSpeedBigger.current = false;
				}
			},
			loadMoreProps: loadMoreProps,
			waitScroll: waitScroll,
			skipRenderProps,
		});

	const shouldRender =
		!isFetching && containerStyles.innerContainerStyle.totalSize > 0;

	console.log('rerender: ', visibleItems, 'msDataRef: ', msDataRef);

	return (
		<>
			<div
				ref={refOuterWrapper}
				className="_outer"
				style={{
					position: 'absolute',
					height: '100vh',
					marginLeft: 0,
					top: 0,
					left: 0,
					right: 0,
					overflow: 'inherit',
					willChange: 'transform',
					WebkitOverflowScrolling: 'touch',
					backgroundColor: 'beige',
				}}
			>
				<div
					ref={refInnerWrapper}
					className="_inner"
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						height: containerStyles.innerContainerStyle.totalSize,
						width: '100%',
						backgroundColor: refSpeedBigger.current ? backgroundColor : 'white',
					}}
				>
					{renderVisibleItems({
						visibleItems,
						perfectGridData,
						scrollEvent: refScollEvent.current,
					})}
				</div>
			</div>
		</>
	);
}

export { InfiniteGrid };
