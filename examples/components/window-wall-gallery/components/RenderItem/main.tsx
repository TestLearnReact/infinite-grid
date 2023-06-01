import React from 'react';
import { IRenderItemProps } from '@module/infinite-grid';
import { IData2 } from '../../../../data';

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
							width: row.width,
						}}
					>
						{`${index}_${row.id}`}
					</div>
				);
				left += row.width;
				return Item;
			})}
		</>
	);
};
