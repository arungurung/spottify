import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getAppSession } from "@/utils/session";

const logoutFn = createServerFn().handler(async () => {
	const session = await getAppSession();
	await session.clear();
	throw redirect({
		to: "/",
	});
});

export const Route = createFileRoute("/logout")({
	preload: false,
	loader: () => logoutFn(),
});
