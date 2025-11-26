import { useEffect, useId, useRef } from "react";
import { Motion, useReducedMotion } from "@/components/motion/MotionProvider";
import { useUIStore } from "@/components/motion/uiStore";

function useMediaQuery(query: string) {
	if (typeof window === "undefined") return false;
	return window.matchMedia(query).matches;
}

export function EntityDetailPanel() {
	const { open, closePanel, entityType, entityId } = useUIStore();
	const reduced = useReducedMotion();
	const wide = useMediaQuery("(min-width: 1024px)");
	const initialFocusRef = useRef<HTMLButtonElement>(null);
	const headingId = useId();

	useEffect(() => {
		if (open) {
			initialFocusRef.current?.focus();
		}
	}, [open]);

	if (!open) return null;

	const isDrawer = wide;
	const panelVariants = isDrawer
		? {
				hidden: { x: 32, opacity: 0 },
				show: { x: 0, opacity: 1 },
			}
		: {
				hidden: { y: 16, opacity: 0 },
				show: { y: 0, opacity: 1 },
			};

	return (
		<div aria-hidden={!open}>
			{/* Backdrop */}
			<Motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: reduced ? 0 : 0.2 }}
				className="fixed inset-0 z-40 bg-black/40"
				onClick={closePanel}
			/>
			{/* Panel */}
			<Motion.div
				initial="hidden"
				animate="show"
				exit="hidden"
				variants={panelVariants}
				transition={{ type: "spring", stiffness: 260, damping: 25 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby={headingId}
				className={
					isDrawer
						? "fixed right-0 top-0 z-50 h-full w-[min(520px,100vw)] overflow-y-auto bg-white p-6 shadow-xl"
						: "fixed left-1/2 top-16 z-50 w-[min(720px,90vw)] -translate-x-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
				}
			>
				<div className="flex items-start justify-between">
					<h2 id={headingId} className="text-xl font-semibold text-gray-900">
						Details
					</h2>
					<button
						ref={initialFocusRef}
						type="button"
						onClick={closePanel}
						className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					>
						Close
					</button>
				</div>
				<div className="mt-4 text-sm text-gray-700">
					<p className="mb-2">Type: {entityType}</p>
					<p>ID: {entityId}</p>
					{/* TODO: mount minimal data blocks here (10 items) and lazy-load deeper sections */}
				</div>
			</Motion.div>
		</div>
	);
}
