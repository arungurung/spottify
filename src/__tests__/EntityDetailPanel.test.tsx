import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UIStoreProvider, useUIStore } from "@/components/motion/uiStore";
import { EntityDetailPanel } from "@/components/panel/EntityDetailPanel";

function OpenButton() {
	const { openPanel } = useUIStore();
	return (
		<button type="button" onClick={() => openPanel("artist", "123")}>
			open
		</button>
	);
}

describe("EntityDetailPanel", () => {
	it("opens and closes", () => {
		const { getByText, queryByText } = render(
			<UIStoreProvider>
				<OpenButton />
				<EntityDetailPanel />
			</UIStoreProvider>,
		);
		fireEvent.click(getByText("open"));
		expect(getByText("Details")).toBeTruthy();
		fireEvent.click(getByText("Close"));
		expect(queryByText("Details")).toBeNull();
	});
});
