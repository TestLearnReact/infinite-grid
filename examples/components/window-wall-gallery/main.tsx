import React from 'react';
import { dataWidthHeightRatio } from '../../data';

import InfiniteGrid from '@module/infinite-grid';
import { RenderItem } from './components/RenderItem';

export const WindowWallGallery: React.FC = () => {
	return (
		<div>
			<InfiniteGrid
				inputData={dataWidthHeightRatio}
				renderItem={({ index, gridItemData, offset, size }) => (
					<RenderItem
						key={index}
						index={index}
						gridItemData={gridItemData}
						offset={offset}
						size={size}
					/>
				)}
			/>
		</div>
	);
};

export default WindowWallGallery;
