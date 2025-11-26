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
	return (
		<div
			role="tablist"
			aria-orientation="horizontal"
			className="relative inline-flex rounded-lg bg-white p-1 shadow-sm"
		>
			{tabs.map((t) => {
				const active = t.id === activeId;
				return (
					<button
						key={t.id}
						role="tab"
						aria-selected={active}
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
