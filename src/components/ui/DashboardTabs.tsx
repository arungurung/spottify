import { Motion, useReducedMotion } from "@/components/motion/MotionProvider";

interface TabDef {
	id: string;
	label: string;
}

interface DashboardTabsProps {
	tabs: TabDef[];
	activeId: string;
	onChange: (id: string) => void;
}

export function DashboardTabs({
	tabs,
	activeId,
	onChange,
}: DashboardTabsProps) {
	const reduced = useReducedMotion();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const currentIndex = tabs.findIndex((t) => t.id === activeId);
		let nextIndex = currentIndex;

		switch (e.key) {
			case "ArrowLeft":
				e.preventDefault();
				nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
				break;
			case "ArrowRight":
				e.preventDefault();
				nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
				break;
			case "Home":
				e.preventDefault();
				nextIndex = 0;
				break;
			case "End":
				e.preventDefault();
				nextIndex = tabs.length - 1;
				break;
			default:
				return;
		}

		onChange(tabs[nextIndex].id);
	};

	return (
		<div
			role="tablist"
			aria-orientation="horizontal"
			className="relative inline-flex rounded-lg bg-white p-1 shadow-sm"
			onKeyDown={handleKeyDown}
		>
			{tabs.map((t) => {
				const active = t.id === activeId;
				return (
					<button
						key={t.id}
						role="tab"
						aria-selected={active}
						tabIndex={active ? 0 : -1}
						className={`relative rounded-md px-4 py-2 text-sm font-medium ${active ? "text-white" : "text-gray-700 hover:bg-gray-100"}`}
						onClick={() => onChange(t.id)}
						style={{ position: "relative" }}
						type="button"
					>
						{t.label}
						{active && (
							<Motion.div
								layoutId="tab-indicator"
								className="absolute inset-0 z-[-1] rounded-md bg-green-600"
								transition={{ duration: reduced ? 0 : 0.2 }}
							/>
						)}
					</button>
				);
			})}
		</div>
	);
}
