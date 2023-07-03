import React, { useCallback, useRef, useState } from 'react';
import { useWallLayout } from './hooks';
import { dataWidthHeightRatio as inputData } from './data';

const BREAKPOINTS = [
	{ maxWidth: 500, count: 10 },
	{ maxWidth: 1000, count: 20 },
	{ maxWidth: 1500, count: 30 },
	{ maxWidth: 2000, count: 40 },
];

export const WallGallery: React.FC = () => {
	const [rect, setRect] = useState({ width: 0, height: 0 });

	const refViewport = useCallback((node: HTMLDivElement) => {
		if (node !== null) {
			const rect = node.getBoundingClientRect();
			setRect({ width: rect.width, height: rect.height });
		}
	}, []);

	const { outputData } = useWallLayout({
		vpWidth: rect.width,
		minWidth: 500,
		inputData,
		breakpoints: BREAKPOINTS,
	});
	let left = 0;
	let top = 0;
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
				{outputData.map((row) => {
					const Row = row.map((item) => {
						const Item = (
							<div
								key={item.id}
								style={{
									position: 'absolute',
									top: top,
									height: item.height,
									width: item.width,
									left: left,
									overflow: 'hidden',
								}}
							>
								{`${item.id}`}
							</div>
						);
						left += item.width;
						return Item;
					});
					left = 0;
					top += row[0].height;
					return Row;
				})}
			</div>
		</>
	);
};

export default WallGallery;
