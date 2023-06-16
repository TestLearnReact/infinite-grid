import { Measure } from '../../types';
import { TCacheValues } from '../use-cache';

type IOuterContainerStyle = {
	height: number;
	width: number;
	top: number;
	left: number;
};
type IInnerContainerStyle = {
	innerMargin: number;
	totalSize: number;
	innerSize: number;
	heightInner: number;
	widthInner: number;
};

export type IContainerStyles = {
	outerContainerStyle: IOuterContainerStyle;
	innerContainerStyle: IInnerContainerStyle;
};

export type IReturnContainerStyles = {
	containerStyles: IContainerStyles;
	measured: number;
	_resize: boolean;
};

export interface IProps<O, I> {
	msDataRef: React.MutableRefObject<Measure[]>;
	cache: TCacheValues;
	itemsLength: number;
	refOuterContainer: React.RefObject<O>;
	refInnerContainer: React.RefObject<I>;
	_sizeKey: 'height' | 'width';
}
