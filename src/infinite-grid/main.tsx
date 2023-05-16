import React, { useCallback, useRef, useState } from 'react';
import { IInfiniteGridProps, IInputDataMustContain } from './types';
import { useVirtualList } from '@module/use-virtual-list';
import usePerfectLayout from '@module/use-perfect-layout';

export default function InfiniteGrid<ItemType extends IInputDataMustContain>({
	inputData,
}: React.PropsWithChildren<IInfiniteGridProps<ItemType>>) {
	const [dataFetched, setDataFetched] = useState<
		IInfiniteGridProps<ItemType>['inputData']
	>([]);
	const [speed, setSpeed] = useState<number>(0);

	const refSpeedBigger = useRef<boolean>(false);

	const {
		visibleItems,
		containerStyles,
		refOuter: refOuterWrapper,
		refInner: refInnerWrapper,
		isFetching,
		scrollingSpeed,
	} = useVirtualList<ItemType, HTMLDivElement, HTMLDivElement>({
		itemSize: () => 200,
		listDirection: 0,
		overscan: 1,
		useWindowScroll: true,
		items: inputData,
		// loadMoreProps: {
		// 	loadMoreCount: 200,
		// 	isItemLoaded: (i) => {
		// 		return (
		// 			//dataFetched.length >= 100 ||
		// 			isItemLoadedArr && isItemLoadedArr[i] == true
		// 		);
		// 	},
		// 	loadMore: async (event) => {
		// 		return await loadData(event, setDataFetched);
		// 	},
		// },
		onScroll: (e) => {
			if (e.scrollSpeed > 12 && !refSpeedBigger.current) {
				refSpeedBigger.current = true;
				setSpeed(e.scrollSpeed);
			}
			if (e.scrollSpeed <= 12 && refSpeedBigger.current) {
				refSpeedBigger.current = false;
			}
		},
		waitScroll: 40,
		skipRenderProps: { scrollSpeedSkip: 12, waitRender: 400 },
	});

	const shouldRender =
		!isFetching && containerStyles.innerContainerStyle.totalSize > 0;

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
						backgroundColor: refSpeedBigger.current ? 'beige' : 'white',
					}}
				>
					{shouldRender ? (
						visibleItems.map((item) => {
							return (
								<div
									key={item.item.id}
									style={{
										position: 'absolute',
										top: item.offset,
										paddingLeft: 0,
										height: item.size,
									}}
								>
									{item.item.id}
								</div>
							);
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
