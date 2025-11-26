import { domAnimation, LazyMotion, m } from "framer-motion";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ReducedMotionContext = createContext(false);

export function useReducedMotion() {
	return useContext(ReducedMotionContext);
}

interface MotionProviderProps {
	children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
	const [hydrated, setHydrated] = useState(false);
	const reduced = useMemo(() => {
		if (typeof window === "undefined") return true;
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		return mq.matches;
	}, []);

	useEffect(() => {
		setHydrated(true);
	}, []);

	return (
		<ReducedMotionContext.Provider value={reduced}>
			<LazyMotion features={domAnimation} strict>
				{/* Avoid SSR mismatch by rendering children after hydration for motion-specific elements */}
				{hydrated ? children : children}
			</LazyMotion>
		</ReducedMotionContext.Provider>
	);
}

export const Motion = m;
