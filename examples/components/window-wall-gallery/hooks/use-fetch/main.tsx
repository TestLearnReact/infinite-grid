import { useCallback, useEffect, useReducer, useRef } from 'react';
import { LoadMoreEvent } from '@module/infinite-grid';
import { IData2, dataWidthHeightRatio } from '../../../../data';

interface IFetchData {
	fetchData: (event: LoadMoreEvent) => Promise<
		| {
				hasFetchedMore: boolean;
		  }
		| undefined
	>;
}

interface State<T> {
	data?: T;
	error?: Error;
	hasMore?: boolean;
	hasFetchedMore?: boolean;
}

type Cache<T> = { [loadIndex: number]: T };

// discriminated union type
type Action<T> =
	| { type: 'loading' }
	| { type: 'fetched'; payload: T; hasMore: boolean; hasFetchedMore: boolean }
	| { type: 'error'; payload: Error };

function useFetch<T = unknown>({
	options,
}: {
	options?: RequestInit;
}): State<T> & IFetchData {
	const cache = useRef<Cache<T>>({});

	// Used to prevent state update if the component is unmounted
	const cancelRequest = useRef<boolean>(false);

	const initialState: State<T> = {
		error: undefined,
		data: undefined,
		hasMore: undefined,
		hasFetchedMore: undefined,
	};

	// Keep state logic separated
	const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
		switch (action.type) {
			case 'loading':
				return { ...initialState };
			case 'fetched':
				return {
					...initialState,
					data: action.payload,
					hasMore: action.hasMore,
				};
			case 'error':
				return { ...initialState, error: action.payload };
			default:
				return state;
		}
	};

	const [state, dispatch] = useReducer(fetchReducer, initialState);

	const fetchData = useCallback(async (event: LoadMoreEvent) => {
		// Do nothing if the url is not given
		if (!event) return;
		console.log('cache.current[loadIndex]', event.loadIndex, cache.current);

		cancelRequest.current = false;

		dispatch({ type: 'loading' });

		const { loadIndex, startIndex, stopIndex } = event;

		let lastCacheId = -1;

		// If a cache exists for this url, return it
		// if (cache.current[loadIndex]) {
		// 	lastCacheId = (cache.current[loadIndex] as IData2[])[
		// 		(cache.current[loadIndex] as IData2[]).length - 1
		// 	].id;

		// 	dispatch({
		// 		type: 'fetched',
		// 		payload: cache.current[loadIndex],
		// 		hasMore:
		// 			dataWidthHeightRatio[dataWidthHeightRatio.length - 1].id >
		// 			lastCacheId,
		// 		hasFetchedMore: true,
		// 	});
		// 	return;
		// }

		try {
			const sto = (loadIndex + 1) * 1000;
			const sta = 0; //sto - 50;

			const dataFetched = dataWidthHeightRatio.slice(sta, sto);

			// const dataFetched = dataWidthHeightRatio.slice(
			// 	startIndex,
			// 	stopIndex + 11
			// );

			// let s = startIndex;
			// if (startIndex > 0) s = s + 10 - 3;

			// const dataFetched = dataWidthHeightRatio.slice(
			// 	startIndex,
			// 	stopIndex + 11
			// );
			//console.log('dataFetched', s, startIndex, dataFetched);
			lastCacheId = dataFetched[dataFetched.length - 1].id;

			if (dataFetched.length <= 0) {
				// isItemLoadedArr[loadIndex] = false;
				return { hasFetchedMore: false };
			}

			if (cache.current[loadIndex]) {
				//debugger;
				return { hasFetchedMore: false };
			}

			// const response = await fetch(url, options);
			// if (!response.ok) {
			// 	throw new Error(response.statusText);
			//

			const data = dataFetched as T;
			cache.current[loadIndex] = data;
			if (cancelRequest.current) return;

			dispatch({
				type: 'fetched',
				payload: data,
				hasMore:
					dataWidthHeightRatio[dataWidthHeightRatio.length - 1].id >
					lastCacheId,
				hasFetchedMore: true,
			});

			return { hasFetchedMore: true };
		} catch (error) {
			if (cancelRequest.current) return;

			dispatch({ type: 'error', payload: error as Error });
		}
	}, []);

	// useEffect(() => {
	// 	// Do nothing if the url is not given
	// 	if (!event) return;

	// 	cancelRequest.current = false;

	// 	const fetchData = async () => {
	// 		dispatch({ type: 'loading' });

	// 		const { loadIndex, startIndex, stopIndex } = event;

	// 		// If a cache exists for this url, return it
	// 		if (cache.current[loadIndex]) {
	// 			console.log(
	// 				'ääää',
	// 				cache.current[loadIndex],
	// 				cache.current[loadIndex][cache.current[loadIndex].length - 1].id
	// 			);
	// 			dispatch({
	// 				type: 'fetched',
	// 				payload: cache.current[loadIndex],
	// 				hasMore:
	// 					dataWidthHeightRatio[dataWidthHeightRatio.length - 1].id >
	// 					cache.current[loadIndex][cache.current[loadIndex].length - 1].id,
	// 				hasFetchedMore: true,
	// 			});
	// 			return;
	// 		}

	// 		try {
	// 			const dataFetched = dataWidthHeightRatio.slice(
	// 				startIndex,
	// 				stopIndex + 1
	// 			);

	// 			if (dataFetched.length <= 0) {
	// 				// isItemLoadedArr[loadIndex] = false;
	// 				return { hasFetchedMore: false };
	// 			}

	// 			// const response = await fetch(url, options);
	// 			// if (!response.ok) {
	// 			// 	throw new Error(response.statusText);
	// 			//

	// 			const data = dataFetched as T;
	// 			cache.current[loadIndex] = data;
	// 			if (cancelRequest.current) return;
	// 			console.log(
	// 				'üüüüüü',
	// 				cache.current[loadIndex],
	// 				cache.current[loadIndex][cache.current[loadIndex].length - 1].id
	// 			);
	// 			dispatch({
	// 				type: 'fetched',
	// 				payload: data,
	// 				hasMore: true,
	// 				hasFetchedMore: true,
	// 			});

	// 			return { hasFetchedMore: true };
	// 		} catch (error) {
	// 			if (cancelRequest.current) return;

	// 			dispatch({ type: 'error', payload: error as Error });
	// 		}
	// 	};

	// 	void fetchData();

	// 	// Use the cleanup function for avoiding a possibly...
	// 	// ...state update after the component was unmounted
	// 	return () => {
	// 		cancelRequest.current = true;
	// 	};
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [event]);

	return { ...state, fetchData };
}

export default useFetch;
// https://usehooks-ts.com/react-hook/use-fetch

// import { useEffect, useReducer, useRef } from 'react';

// interface State<T> {
// 	data?: T;
// 	error?: Error;
// }

// type Cache<T> = { [url: string]: T };

// // discriminated union type
// type Action<T> =
// 	| { type: 'loading' }
// 	| { type: 'fetched'; payload: T }
// 	| { type: 'error'; payload: Error };

// function useFetch<T = unknown>(url?: string, options?: RequestInit): State<T> {
// 	const cache = useRef<Cache<T>>({});

// 	// Used to prevent state update if the component is unmounted
// 	const cancelRequest = useRef<boolean>(false);

// 	const initialState: State<T> = {
// 		error: undefined,
// 		data: undefined,
// 	};

// 	// Keep state logic separated
// 	const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
// 		switch (action.type) {
// 			case 'loading':
// 				return { ...initialState };
// 			case 'fetched':
// 				return { ...initialState, data: action.payload };
// 			case 'error':
// 				return { ...initialState, error: action.payload };
// 			default:
// 				return state;
// 		}
// 	};

// 	const [state, dispatch] = useReducer(fetchReducer, initialState);

// 	useEffect(() => {
// 		// Do nothing if the url is not given
// 		if (!url) return;

// 		cancelRequest.current = false;

// 		const fetchData = async () => {
// 			dispatch({ type: 'loading' });

// 			// If a cache exists for this url, return it
// 			if (cache.current[url]) {
// 				dispatch({ type: 'fetched', payload: cache.current[url] });
// 				return;
// 			}

// 			try {
// 				const response = await fetch(url, options);
// 				if (!response.ok) {
// 					throw new Error(response.statusText);
// 				}

// 				const data = (await response.json()) as T;
// 				cache.current[url] = data;
// 				if (cancelRequest.current) return;

// 				dispatch({ type: 'fetched', payload: data });
// 			} catch (error) {
// 				if (cancelRequest.current) return;

// 				dispatch({ type: 'error', payload: error as Error });
// 			}
// 		};

// 		void fetchData();

// 		// Use the cleanup function for avoiding a possibly...
// 		// ...state update after the component was unmounted
// 		return () => {
// 			cancelRequest.current = true;
// 		};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [url]);

// 	return state;
// }

// export default useFetch;
// // https://usehooks-ts.com/react-hook/use-fetch
