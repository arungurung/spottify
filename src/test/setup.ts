// Vitest setup: provide DOM APIs used by components/tests

// matchMedia stub for components that query reduced motion or breakpoints
if (!window.matchMedia) {
	const mqlFactory = (query: string): MediaQueryList => {
		return {
			matches: false,
			media: query,
			onchange: null,
			addListener: () => undefined,
			removeListener: () => undefined,
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
			dispatchEvent: () => false,
		} as MediaQueryList;
	};
	window.matchMedia = mqlFactory;
}

// requestAnimationFrame fallback for framer-motion
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (cb: FrameRequestCallback) =>
		setTimeout(cb, 16) as unknown as number;
}
