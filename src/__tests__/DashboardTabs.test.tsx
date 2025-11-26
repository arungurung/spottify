import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardTabs } from "@/components/ui/DashboardTabs";

describe("DashboardTabs", () => {
	it("renders tabs with roles", () => {
		const { getByRole } = render(
			<DashboardTabs
				tabs={[
					{ id: "tracks", label: "Top Tracks" },
					{ id: "artists", label: "Top Artists" },
				]}
				activeId="tracks"
				onChange={() => {}}
			/>,
		);
		expect(getByRole("tablist")).toBeTruthy();
	});
});
