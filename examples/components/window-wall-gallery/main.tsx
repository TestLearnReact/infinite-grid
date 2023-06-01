import React, { useState } from 'react';
import { IData2, dataWidthHeightRatio } from '../../data';

import InfiniteGrid, { LoadMoreEvent } from '@module/infinite-grid';
import { RenderItem } from './components/RenderItem';
import useFetch from './hooks/use-fetch/main';

const url = 'http://jsonplaceholder.typicode.com/posts';

export const WindowWallGallery: React.FC = () => {
	// const [event, setEvent] = useState<LoadMoreEvent>();

	const { data = [], error, hasMore, fetchData } = useFetch<IData2[]>({});

	// if (error) return <p>There is an error.</p>;
	// if (!data) return <p>Loading...</p>;
	// return <p>{data[0].title}</p>

	//console.log('# data', data, error, hasMore);

	//if (!data) return <p>Loading...</p>;
	console.log('DATA::: ', data);
	return (
		<>
			{!data ? (
				<p>Loading...</p>
			) : (
				<div>
					<InfiniteGrid
						inputData={data}
						renderItem={({ index, gridItemData, offset, size }) => (
							<RenderItem
								key={index}
								index={index}
								gridItemData={gridItemData}
								offset={offset}
								size={size}
							/>
						)}
						// virtualListSubProps={{
						// 	loadMoreProps: {
						// 		isItemLoaded(index) {
						// 			// console.log('##');
						// 			return false;
						// 		},
						// 		loadMore: async (event) => {
						// 			console.log('# loadMore...', event);
						// 			// setEvent(event);
						// 			await fetchData(event);
						// 			return { hasFetchedMore: true };
						// 		},
						// 		loadMoreCount: 100,
						// 	},
						// 	skipRenderProps: { scrollSpeedSkip: 12, waitRender: 400 },
						// 	overscan: 1,
						// 	useWindowScroll: true,
						// 	waitScroll: 40,
						// 	backgroundColor: 'beige', // todo css class?
						// }}
						loadMoreProps={{
							isItemLoaded(index) {
								// console.log('##');
								return data.length > 0 && data[data.length - 1].id == 99;
							},
							loadMore: async (event) => {
								console.log('# loadMore...', event);
								// setEvent(event);
								await fetchData(event);
								return { hasFetchedMore: true };
							},
							loadMoreCount: 20,
						}}
						overscan={1}
						// useWindowScroll={true}
						// waitScroll={40}
						backgroundColor={'lightGrey'} // todo css class?
						skipRenderProps={{ scrollSpeedSkip: 12, waitRender: 400 }}
					/>
				</div>
			)}
		</>
	);
};

export default WindowWallGallery;
