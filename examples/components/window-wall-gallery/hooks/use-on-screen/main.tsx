import { RefObject, useState, useMemo, useEffect } from 'react';

export function useIsVisible(ref: RefObject<HTMLElement>) {
	const [isIntersecting, setIntersecting] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting)
		);

		observer.observe(ref.current);
		return () => {
			observer.disconnect();
		};
	}, [ref]);

	return isIntersecting;
}

export default function useOnScreen(ref: RefObject<HTMLElement>) {
	const [isIntersecting, setIntersecting] = useState(false);

	const observer = useMemo(
		() =>
			new IntersectionObserver(([entry]) =>
				setIntersecting(entry.isIntersecting)
			),
		[ref]
	);

	useEffect(() => {
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return isIntersecting;
}
