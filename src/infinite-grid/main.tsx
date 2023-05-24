import React, { useCallback, useRef, useState } from 'react';
import { IInfiniteGridProps, IInputDataMustContain } from './types';
import { useVirtualList } from '@module/use-virtual-list';
import usePerfectLayout, { IPerfectGridData } from '@module/use-perfect-layout';

export default function InfiniteGrid<ItemType extends IInputDataMustContain>({
	inputData,
	virtualListSubProps = {
		overscan: 3,
		skipRenderProps: { scrollSpeedSkip: 12, waitRender: 400 },
		useWindowScroll: true,
		waitScroll: 40,
		backgroundColor: 'lightgrey', // todo css class?
	},
	renderItem,
}: React.PropsWithChildren<IInfiniteGridProps<ItemType>>) {
	const refOuterWrapper = useRef<HTMLDivElement>(null);
	const refInnerWrapper = useRef<HTMLDivElement>(null);

	const refSpeedBigger = useRef<boolean>(false);

	const [dataFetched, setDataFetched] = useState<
		IInfiniteGridProps<ItemType>['inputData']
	>([]);
	const [_, setSpeed] = useState<number>(0);

	const {
		overscan,
		useWindowScroll,
		waitScroll,
		skipRenderProps = { scrollSpeedSkip: 12, waitScroll: 40 },
		backgroundColor,
	} = virtualListSubProps;

	const { perfectGridData, totalHeight } = usePerfectLayout<
		ItemType,
		HTMLDivElement
	>({
		items: inputData,
		refVpWrapper: refOuterWrapper,
		idealRowHeight: ({ viewportHeight, viewportWidth }) => viewportWidth / 2,
	});

	const { visibleItems, containerStyles, isFetching } = useVirtualList<
		IPerfectGridData<ItemType>[0], //ItemType,
		HTMLDivElement,
		HTMLDivElement
	>({
		xouterRef: refOuterWrapper,
		xinnerRef: refInnerWrapper,
		itemSize: (item) => item[0].height,
		listDirection: 0,
		overscan,
		useWindowScroll,
		items: perfectGridData, //inputData,
		onScroll: (e) => {
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
		waitScroll,
		skipRenderProps: virtualListSubProps.skipRenderProps,
	});

	const shouldRender =
		!isFetching && containerStyles.innerContainerStyle.totalSize > 0;

	console.log(
		'rerender',
		shouldRender,
		visibleItems
		// perfectGridData,
		// perfectGridData.length,
		// totalHeight
	);

	return (
		<>
			<div
				ref={refOuterWrapper}
				className="_outer"
				style={{
					position: 'absolute',
					height: '100vh',
					marginLeft: 0,
					top: 60,
					left: 60,
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
					{shouldRender ? (
						visibleItems.map((item) => {
							return renderItem({
								index: item.itemIndex,
								gridItemData: perfectGridData[item.itemIndex],
								offset: item.offset,
								size: item.size,
							});
						})
					) : (
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								height: containerStyles.innerContainerStyle.totalSize,
								width: '100%',
								backgroundColor: 'grey',
							}}
						>
							Loading...
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export { InfiniteGrid };
