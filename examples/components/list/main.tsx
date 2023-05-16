import React from 'react';
import { VerticalListWindow } from '../vertikal-list-window';
import { data, dataWidthHeightRatio } from '../../data';
import InfiniteGrid from '@module/infinite-grid';

export const LIST_HEIGHT = 300;
export const LIST_WIDTH = 600;

export const ListTypes: React.FC = () => {
	return (
		<div
			className="_lists"
			// style={{
			// 	position: 'relative',
			// 	top: 0,
			// 	left: 0,
			// 	margin: 0,
			// 	padding: 0,
			// }}
		>
			<InfiniteGrid inputData={dataWidthHeightRatio} />
			{/* <VerticalListWindow
				listHeight={LIST_HEIGHT}
				listWidth={LIST_WIDTH}
				data={data}
			/> */}
			{/* <VerticalList
				listHeight={LIST_HEIGHT}
				listWidth={LIST_WIDTH}
				data={data}
			/> */}
			{/* <HorizontalList
				listHeight={LIST_HEIGHT}
				listWidth={LIST_WIDTH}
				data={data}
			/> */}
		</div>
	);
};
