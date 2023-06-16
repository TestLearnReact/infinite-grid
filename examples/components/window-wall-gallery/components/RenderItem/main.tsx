import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IRenderItemProps } from '@module/infinite-grid';
import { IData2 } from '../../../../data';

import Img1 from '../../../../assets/avatar1.png';

import './style.css';
import useOnScreen from '../../hooks/use-on-screen/main';

const Image: React.FC<{
	index: number;
	id: number;
	width: number;
}> = ({ index, id, width }) => {
	return (
		<div className="card__border" style={{ width, height: width }}>
			<div className="card__img"></div>
			<p style={{ fontSize: 8 }}>{`${index}_${id}`}</p>
		</div>
	);
};

const RowItem: React.FC<{
	index: number;
	offset: number;
	left: number;
	size: number;
	rowItemData: IData2 & {
		height: number;
		width: number;
	};
}> = ({ index, offset, left, rowItemData }) => {
	//const [showClass, setShowClass] = useState(scrollForward ? 'hide' : 'showed');
	const [showClass, setShowClass] = useState('');

	const { id, width, height, ratio } = rowItemData;

	const ref = useRef(null);

	const refLast = useRef(0);
	const refcount = useRef(0);

	const visible = useOnScreen(ref);

	const lessInner = 7;
	const widthInner = (ratio == 2 ? width / 2 : width) - lessInner;
	const heightInner = height - lessInner;

	return (
		<div
			ref={ref}
			key={id}
			className={`card ${showClass}`}
			style={{
				position: 'absolute',
				top: offset,
				left: left,
				paddingLeft: 0,
				height: height,
				width: width,
				overflow: 'hidden',
			}}
		>
			<p
				style={{ position: 'absolute', top: 0, left: 0, fontSize: 8 }}
			>{`${index}`}</p>
			<p
				style={{ position: 'absolute', bottom: 0, left: 0, fontSize: 8 }}
			>{`${id}`}</p>
			<div
				style={{
					position: 'absolute',
					left: (width - widthInner) / 2,
					top: (height - heightInner) / 2,
					width: widthInner,
					height: heightInner,
					backgroundColor: 'grey',
					opacity: 0.2,
					borderRadius: '50%',
				}}
			>
				<img src={Img1} alt="" style={{ width: '80%', height: '80%' }} />
			</div>
			{/* <Image index={index} id={id} width={30} /> */}
		</div>
	);
};

/** virtual row with image data array */
export const RenderItem: React.FC<IRenderItemProps<IData2>> = ({
	index,
	gridItemData,
	offset,
	size,
	visibleItems,
}) => {
	let left = 0;

	if (!gridItemData) return null;

	return (
		<>
			{gridItemData.map((rowItem, ri) => {
				const Item = (
					<RowItem
						index={index}
						key={rowItem.id}
						offset={offset}
						left={left}
						size={size}
						rowItemData={rowItem}
					/>
				);
				left += rowItem.width;

				return Item;
			})}
		</>
	);
};

//if (visible) console.log('visible', id);

// useEffect(() => {
// 	if (visible) refcount.current++;
// }, [visibleItems]);

// useEffect(() => {
// 	if (visible && scrollForward) {
// 		refLast.current = id;

// 		console.log(id, rowItemIndex, refLast.current, gridItemData.length);
// 		const timer = setTimeout(() => {
// 			setShowClass('show');
// 		}, rowItemIndex * 30);

// 		return () => {
// 			if (timer !== null) {
// 				clearTimeout(timer);
// 			}
// 		};
// 	}
// }, [visible, id, rowItemIndex, scrollForward]);

// if (ref && ref.current && ref.current.classList.contains('show')) {
// 	console.log('Element contains class');
// } else {
// 	console.log('Element does NOT contain class');
// }

// useEffect(() => {
// 	// show immediately
// 	if (!scrollForward) return;
// 	if (!ref?.current) return;
// 	//console.log(index, id, lastId);
// 	const timer = setTimeout(() => {
// 		//if (!ref.current.classList.contains('show'))
// 		setShowClass('show');
// 		//refShowedArr.current = id;
// 	}, (id - lastId) * 50);

// 	// const timer = setTimeout(() => {
// 	// 	if (!ref.current.classList.contains('show')) setShowClass('show');
// 	// 	//refShowedArr.current = id;
// 	// }, index + id * 5);
// 	return () => clearTimeout(timer);
// }, [index, id, scrollForward, rowItemIndex, rowIndex, lastId]);
