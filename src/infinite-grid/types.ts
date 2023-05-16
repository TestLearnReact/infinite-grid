export type IInputDataMustContain = { id: number; ratio: number }; // toto delete id

export interface IInfiniteGridProps<T extends IInputDataMustContain> {
	inputData: T[];
}
