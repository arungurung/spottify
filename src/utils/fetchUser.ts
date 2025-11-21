import { createServerFn } from "@tanstack/react-start";
import { connectDB } from "@/lib/db";
import { useAppSession } from "@/utils/session";

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	const session = await useAppSession();
	await connectDB();

	if (!session.data.userEmail) {
		return null;
	}

	return {
		email: session.data.userEmail,
	};
});
