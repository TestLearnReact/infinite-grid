import React, { useCallback, useRef, useState } from 'react';
import { IData2, dataWall, dataWidthHeightRatio } from '../../data';

import InfiniteGrid, { LoadMoreEvent } from '@module/infinite-grid';
import { RenderItem } from './components/RenderItem';
import useFetch from './hooks/use-fetch/main';
import useRatio from './hooks/use-ratio/main';
import { MyForm, RenderVisibleItems } from './components';

const url = 'http://jsonplaceholder.typicode.com/posts';

export const WindowWallGallery: React.FC = () => {
	const [rect, setRect] = useState({ width: 0, height: 0 });

	const refHasFetched = useRef<boolean[]>([]);

	const refViewport = useCallback((node: HTMLDivElement) => {
		if (node !== null) {
			const rect = node.getBoundingClientRect();
			console.log(rect);
			setRect({ width: rect.width, height: rect.height });
		}
	}, []);

	const { data = [], error, hasMore, fetchData } = useFetch<IData2[]>({});

	const { data: ddd, idealRowHeight } = useRatio({
		width: rect.width,
		height: rect.height,
		data,
	});

	if (error) return <p>There is an error.</p>;
	if (!data) return <p>...Loading...</p>;

	//console.log('DATA::: ', data, wallData, dataWithRatio);

	return (
		<>
			<div
				ref={refViewport}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '101vh',
					WebkitOverflowScrolling: 'touch',
				}}
			>
				<InfiniteGrid
					idealRowHeight={idealRowHeight}
					inputData={ddd}
					loadMoreProps={{
						isItemLoaded(index) {
							return refHasFetched.current[index];
							//return data.length > 0 && data[data.length - 1].id == 9999;
						},
						loadMore: async (event) => {
							await fetchData(event);
							refHasFetched.current[event.loadIndex] = true;
							return { hasFetchedMore: true };
						},
						loadMoreCount: 80,
					}}
					overscan={10}
					backgroundColor={'lightGrey'} // todo css class?
					skipRenderProps={{ scrollSpeedSkip: 12, waitRender: 400 }}
					renderVisibleItems={(props) => (
						<MyForm {...props} ref={props.refForwarded} />
					)}
				/>
			</div>
			{/* )} */}
		</>
	);
};

export default WindowWallGallery;
