import type { ReactNode } from "react";
import { Motion, useReducedMotion } from "@/components/motion/MotionProvider";

interface AnimatedCardProps {
	children: ReactNode;
	index: number;
	layoutId?: string;
	onClick?: () => void;
	onPrefetch?: () => void;
	onCancelPrefetch?: () => void;
}

export function AnimatedCard({
	children,
	index,
	layoutId,
	onClick,
	onPrefetch,
	onCancelPrefetch,
}: AnimatedCardProps) {
	const reduced = useReducedMotion();

	return (
		<Motion.div
			layoutId={layoutId}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{
				duration: reduced ? 0 : 0.3,
				delay: reduced ? 0 : index * 0.05,
				ease: "easeOut",
			}}
			whileHover={
				reduced
					? undefined
					: {
							scale: 1.02,
							transition: { duration: 0.2 },
						}
			}
			onClick={onClick}
			onMouseEnter={onPrefetch}
			onMouseLeave={onCancelPrefetch}
			onFocus={onPrefetch}
			onBlur={onCancelPrefetch}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.();
				}
			}}
			role="button"
			tabIndex={0}
			aria-haspopup="dialog"
			className="cursor-pointer"
		>
			{children}
		</Motion.div>
	);
}
