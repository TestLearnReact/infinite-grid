import React, { useCallback, useEffect, useRef, useState } from 'react';

import { IOutV, IRenderVisibleItemsProps } from '@module/infinite-grid';
import { IData2 } from '../../../../data';

export const RenderVisibleItems: React.FC<IRenderVisibleItemsProps<IData2>> = ({
	visibleItems,
	perfectGridData,
	scrollEvent,
}) => {
	const refCurrVisible = useRef<IOutV<IData2>>([]);
	const refPrevVisible = useRef<IOutV<IData2>>([]);

	useEffect(() => {
		refPrevVisible.current = refCurrVisible.current;
		refCurrVisible.current = visibleItems;
	}, [visibleItems]);

	if (visibleItems.length <= 0) return null;

	return <>...</>;
};
