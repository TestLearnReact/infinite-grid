import { type IVirtualListProps } from '@module/use-virtual-list';

export type IInputDataMustContain = { id: number; ratio: number }; // toto delete id

type IVirtualListSubProps<T extends IInputDataMustContain> = Pick<
	IVirtualListProps<T>,
	'skipRenderProps' | 'overscan'
>;

export interface IInfiniteGridProps<T extends IInputDataMustContain> {
	inputData: T[];
	virtualListSubProps?: IVirtualListSubProps<T>;
}
