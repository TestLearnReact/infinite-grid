import { useEffect, useMemo, useState } from 'react';
import { perfectLayout } from './perfect-row-layout';
import { IUsePerfectLayoutProps, IPerfectLayoutResponse } from './types';

export function usePerfectLayout<
	ItemType extends { ratio: number } // todo besser keyof add property?
>({
	items,
	viewportHeight,
	viewportWidth,
	idealRowHeight,
	idealRowWidth,
}: IUsePerfectLayoutProps<ItemType>): IPerfectLayoutResponse<ItemType> {
	const [stateResponse, setStateResponse] = useState<
		IPerfectLayoutResponse<ItemType>
	>({
		perfectGridData: [],
		totalHeight: 0,
	});

	const perfectItemSize = useMemo(() => {
		let perfectItemHeight = viewportHeight / 2;
		let perfectItemWidth = 0;

		if (idealRowHeight) {
			if (typeof idealRowHeight === 'function') {
				perfectItemHeight = idealRowHeight({
					viewportHeight,
					viewportWidth,
				});
			} else {
				perfectItemHeight = idealRowHeight;
			}
		}

		if (idealRowWidth) {
			if (typeof idealRowWidth === 'function') {
				perfectItemWidth = idealRowWidth({
					viewportHeight,
					viewportWidth,
				});
			} else {
				perfectItemWidth = idealRowWidth;
			}
		}

		return { perfectItemHeight, perfectItemWidth };
	}, [viewportWidth, viewportHeight, idealRowHeight, idealRowWidth]);

	useEffect(() => {
		//debugger;
		if (items.length > 0 && viewportWidth > 0 && viewportHeight > 0) {
			/**
			 * GENERATE PERFECT LAYOUT
			 */
			const { perfectGridData, totalHeight } = perfectLayout({
				inputData: items,
				viewportWidth,
				viewportHeight,
				idealRowHeight: perfectItemSize.perfectItemHeight,
				useNextToLastPartitionsForLastRow: true,
				optimizeLastRow: { optimize: true, avgLastRowCount: 2 },
			});

			setStateResponse({
				perfectGridData,
				totalHeight,
			});
		}
	}, [
		items,
		items.length,
		viewportWidth,
		viewportHeight,
		perfectItemSize.perfectItemHeight,
	]);

	return stateResponse;
}
