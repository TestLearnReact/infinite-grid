import React, { useCallback } from 'react';
import { VerticalListWindow } from '../vertikal-list-window';
import { IData2, data, dataWidthHeightRatio } from '../../data';
import InfiniteGrid, {
	IRenderItem,
	IRenderItemProps,
} from '@module/infinite-grid';
import { WindowWallGallery } from '../window-wall-gallery';

export const LIST_HEIGHT = 300;
export const LIST_WIDTH = 600;

export const RenderItem: React.FC<IRenderItemProps<IData2>> = ({
	index,
	gridItemData,
	offset,
	size,
}) => {
	let left = 0;

	return (
		<>
			{gridItemData.map((row) => {
				const Item = (
					<div
						key={row.id}
						style={{
							position: 'absolute',
							top: offset,
							left: left,
							paddingLeft: 0,
							height: size,
						}}
					>
						{row.id}
					</div>
				);
				left += row.width;
				return Item;
			})}
		</>
	);
};

export const ListTypes: React.FC = () => {
	const RenderItem2 = useCallback(
		({ index, gridItemData, offset, size }: IRenderItemProps<IData2>) => {
			let left = 0;

			return (
				<>
					{gridItemData.map((row) => {
						const Item = (
							<div
								key={row.id}
								style={{
									position: 'absolute',
									top: offset,
									left: left,
									paddingLeft: 0,
									height: size,
								}}
							>
								{row.id}
							</div>
						);
						left += row.width;
						return Item;
					})}
				</>
			);
		},
		[]
	);

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
			<WindowWallGallery />
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
