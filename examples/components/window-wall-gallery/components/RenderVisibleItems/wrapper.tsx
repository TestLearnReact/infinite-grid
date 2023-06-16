import React, { useImperativeHandle, useRef } from 'react';
import { OnScrollEvent } from '@module/infinite-grid';

export interface RefType {
	scrollEvent: (e: OnScrollEvent) => void;
}

const Wrapper = React.forwardRef((props, ref) => {
	const refScollEvent = useRef<OnScrollEvent>({
		currData: { timestamp: 0, x: 0, y: 0 },
		prevData: { timestamp: 0, x: 0, y: 0 },
		scrollSpeed: 0,
	});

	useImperativeHandle(
		ref,
		() => {
			return {
				scrollEvent(e) {
					console.log('child:', e);
					refScollEvent.current = e;
				},
			};
		},
		[]
	);

	return <FancyButton {...props} ref={ref} />;
});
Wrapper.displayName = 'Wrapper';

// export const RenderVisibleItems = React.forwardRef<
// 	RefType,
// 	IRenderVisibleItemsProps<IData2>
// >(
// 	(
// 		{ visibleItems, perfectGridData, scrollEvent, containerStyles, onScroll },

// 		ref
// 	) => {
