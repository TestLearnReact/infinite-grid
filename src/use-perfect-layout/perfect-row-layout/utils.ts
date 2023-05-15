// Rather than blindly perform a binary search from the maximum width. It starts
// from the ideal width (The ideal width being the width if the images fit
// perfectly in the given container.) and expands to the next width that will
// allow an item to move up a row. This algorithm will find the exact width that
// produces the "ideal" layout and should generally find it in two or three
// passes.
export default function BreakpointPartition({
	imageRatioSequence,
	expectedRowCount,
}: {
	imageRatioSequence: number[];
	expectedRowCount: number;
}) {
	if (imageRatioSequence.length <= 1) return [imageRatioSequence];
	if (expectedRowCount >= imageRatioSequence.length)
		return imageRatioSequence.map((item) => [item]);

	const layoutWidth = findLayoutWidth({ imageRatioSequence, expectedRowCount });
	let currentRow = 0;

	const sumRows: number[][] = Array.from({ length: expectedRowCount })
		.fill([])
		.map(() => []);

	let rr = imageRatioSequence.reduce((rows, imageRatio, c) => {
		if (sum(rows[currentRow]) + imageRatio > layoutWidth) currentRow++;
		rows[currentRow].push(imageRatio);
		//console.log(rows, imageRatio, c, currentRow);
		return rows;
	}, sumRows);

	// todo cleaner / fallback to few items for perfect rows
	if (sumRows.length !== currentRow) {
		rr = sumRows.slice(0, currentRow + 1);
	}

	return rr;
}

// starting at the ideal width, expand to the next breakpoint until we find
// a width that produces the expected number of rows
function findLayoutWidth({
	imageRatioSequence,
	expectedRowCount,
}: {
	imageRatioSequence: number[];
	expectedRowCount: number;
}) {
	const idealWidth = sum(imageRatioSequence) / expectedRowCount;
	const widestItem = Math.max.apply(null, imageRatioSequence);
	let galleryWidth = Math.max(idealWidth, widestItem);
	let layout = getLayoutDetails({
		imageRatioSequence,
		expectedWidth: galleryWidth,
	});
	//galleryWidth += layout.nextBreakpoint; //

	while (layout.rowCount > expectedRowCount) {
		galleryWidth += layout.nextBreakpoint;

		layout = getLayoutDetails({
			imageRatioSequence,
			expectedWidth: galleryWidth,
		});
	}
	return galleryWidth;
}

// find the
function getLayoutDetails({
	imageRatioSequence,
	expectedWidth,
}: {
	imageRatioSequence: number[];
	expectedWidth: number;
}) {
	const startingLayout = {
		currentRowWidth: 0,
		rowCount: 1,
		// the largest possible step to the next breakpoint is the smallest image ratio
		nextBreakpoint: Math.min.apply(null, imageRatioSequence),
	};

	const finalLayout = imageRatioSequence.reduce((layout, itemWidth) => {
		const rowWidth = layout.currentRowWidth + itemWidth;
		let currentRowsNextBreakpoint;

		if (rowWidth > expectedWidth) {
			currentRowsNextBreakpoint = rowWidth - expectedWidth;
			if (currentRowsNextBreakpoint < layout.nextBreakpoint) {
				layout.nextBreakpoint = currentRowsNextBreakpoint;
			}
			layout.rowCount += 1;
			layout.currentRowWidth = itemWidth;
		} else {
			layout.currentRowWidth = rowWidth;
		}

		return layout;
	}, startingLayout);

	const layoutDetails = {
		rowCount: finalLayout.rowCount,
		nextBreakpoint: finalLayout.nextBreakpoint,
	};
	return layoutDetails;
}

function sum(arr: number[]) {
	return arr.reduce((sum, el) => sum + el, 0);
}
