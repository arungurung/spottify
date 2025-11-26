import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
		const client = new QueryClient();
		const { getByText, queryByText } = render(
			<QueryClientProvider client={client}>
				<UIStoreProvider>
					<OpenButton />
					<EntityDetailPanel />
				</UIStoreProvider>
			</QueryClientProvider>,
		);
		fireEvent.click(getByText("open"));
		expect(getByText("Details")).toBeTruthy();
		fireEvent.click(getByText("Close"));
		expect(queryByText("Details")).toBeNull();
	});
});
