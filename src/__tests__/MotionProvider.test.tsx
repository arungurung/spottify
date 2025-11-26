import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	MotionProvider,
	useReducedMotion,
} from "@/components/motion/MotionProvider";

function TestComponent() {
	const reduced = useReducedMotion();
	return (
		<div data-testid="reduced" data-reduced={reduced ? "true" : "false"}>
			ok
		</div>
	);
}

describe("MotionProvider", () => {
	it("renders children", () => {
		const { getByText } = render(
			<MotionProvider>
				<div>child</div>
			</MotionProvider>,
		);
		expect(getByText("child")).toBeTruthy();
	});

	it("provides reduced motion context", () => {
		const { getByTestId } = render(
			<MotionProvider>
				<TestComponent />
			</MotionProvider>,
		);
		expect(getByTestId("reduced")).toBeTruthy();
	});
});
