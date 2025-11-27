import { useEffect, useRef } from "react";

/**
 * Traps focus within a container element (for modal/drawer accessibility).
 * Returns a ref to attach to the container element.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
	const containerRef = useRef<T>(null);

	useEffect(() => {
		if (!active || !containerRef.current) return;

		const container = containerRef.current;
		const focusableSelector =
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

		const getFocusableElements = () => {
			return Array.from(
				container.querySelectorAll<HTMLElement>(focusableSelector),
			).filter((el) => !el.hasAttribute("disabled"));
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;

			const focusable = getFocusableElements();
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement as HTMLElement;

			if (e.shiftKey) {
				// Shift+Tab
				if (active === first || !container.contains(active)) {
					e.preventDefault();
					last.focus();
				}
			} else {
				// Tab
				if (active === last || !container.contains(active)) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		container.addEventListener("keydown", handleKeyDown);
		return () => container.removeEventListener("keydown", handleKeyDown);
	}, [active]);

	return containerRef;
}
