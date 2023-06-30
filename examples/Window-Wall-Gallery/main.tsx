import React, { useCallback, useRef, useState } from 'react';

export const WallGallery: React.FC = () => {
	const [rect, setRect] = useState({ width: 0, height: 0 });

	const refHasFetched = useRef<boolean[]>([]);

	const refViewport = useCallback((node: HTMLDivElement) => {
		if (node !== null) {
			const rect = node.getBoundingClientRect();
			setRect({ width: rect.width, height: rect.height });
		}
	}, []);

	// const { data = [], error, hasMore, fetchData } = useFetch<IData2[]>({});

	// const { data: ddd, idealRowHeight } = useRatio({
	// 	width: rect.width,
	// 	height: rect.height,
	// 	data: dataWidthHeightRatio,
	// });

	// if (error) return <p>There is an error.</p>;
	// if (!data) return <p>...Loading...</p>;

	// //console.log('DATA::: ', data, wallData, dataWithRatio);

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
				.......
			</div>
		</>
	);
};

export default WallGallery;
