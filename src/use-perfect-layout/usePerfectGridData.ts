import { useRef, useState } from 'react';
import { perfectLayout } from './perfect-row-layout';
import {
	IUsePerfectLayoutProps,
	IPerfectLayoutHookResponse,
	TViewportRect,
} from './types';
import { useIsomorphicLayoutEffect } from '../use-virtual-list/hooks'; // todo

const initRect: TViewportRect = {
	height: 0,
	width: 0,
};

export const isNumber = (val: unknown): val is number =>
	typeof val === 'number' && !Number.isNaN(val);

export function usePerfectLayout<
	ItemType extends { ratio: number },
	O extends HTMLElement = HTMLElement
>({
	items,
	refVpWrapper,
	idealRowHeight,
}: IUsePerfectLayoutProps<ItemType, O>): IPerfectLayoutHookResponse<
	ItemType,
	O
> {
	const refOuterContainer = useRef<O | null>(null);
	const refIdealRowHeight = useRef(0);
	const refPrevRect = useRef<TViewportRect>(initRect);

	const [stateResponse, setStateResponse] = useState<
		IPerfectLayoutHookResponse<ItemType, O>
	>({
		perfectGridData: [],
		totalHeight: 0,
		refVpWrapper: refOuterContainer,
	});

	const [viewportRect, setViewportRect] = useState<TViewportRect>(initRect);

	const refPrevLast = useRef();

	useIsomorphicLayoutEffect(() => {
		if (refVpWrapper && refVpWrapper.current) {
			const { height, width } = refVpWrapper.current.getBoundingClientRect();
			if (refPrevRect.current.width !== width) {
				setViewportRect({ height, width });
				refPrevRect.current = { height, width };
			}

			refOuterContainer.current = refVpWrapper.current;
		}
	}, [refVpWrapper]);

	useIsomorphicLayoutEffect(() => {
		refIdealRowHeight.current = viewportRect.width / 2;

		if (idealRowHeight)
			refIdealRowHeight.current = isNumber(idealRowHeight)
				? idealRowHeight
				: idealRowHeight({
						viewportHeight: viewportRect.height,
						viewportWidth: viewportRect.width,
				  });

		const shouldCalc =
			items &&
			items.length > 0 &&
			viewportRect.width > 0 &&
			viewportRect.height > 0 &&
			refIdealRowHeight.current > 0;

		if (shouldCalc) {
			console.log('refPrevLast.current', refPrevLast.current);

			refPrevLast.current = items[items.length];

			/**
			 * GENERATE PERFECT LAYOUT
			 */
			(async () => {
				const { perfectGridData, totalHeight } = await perfectLayout({
					inputData: items,
					viewportWidth: viewportRect.width,
					viewportHeight: viewportRect.height,
					idealRowHeight: refIdealRowHeight.current,
					//useNextToLastPartitionsForLastRow: false, //true,
					optimizeLastRow: { optimize: true, avgLastRowCount: 2 },
					opts: { margin: 0 },
					hasMore: true,
				});
				console.log('perfectGridData', perfectGridData);
				setStateResponse({
					perfectGridData,
					totalHeight,
					refVpWrapper,
				});
			})();
		}
	}, [items, viewportRect]);

	return stateResponse;
}
