import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import mongoose from "mongoose";
import Login from "@/components/Login";
import { hashPassword } from "@/utils/password";
import { useAppSession } from "@/utils/session";

export const loginFn = createServerFn({ method: "POST" })
	.inputValidator((d: { email: string; password: string }) => d)
	.handler(async ({ data }) => {
		// Find the user from db
		const User = mongoose.model("User");
		const user = await User.findOne({
			email: data.email,
		});

		// Create a session
		const session = await useAppSession();

		// check if the user exists
		if (!user) {
			return {
				error: true,
				message: "User not found",
				userNotFound: true,
			};
		}

		// check if the password matches
		const hashedPassword = await hashPassword(data.password);
		if (user.password !== hashedPassword) {
			return {
				error: true,
				message: "Incorrect password",
			};
		}

		await session.update({
			userEmail: user.email,
		});
	});

export const Route = createFileRoute("/_authed")({
	beforeLoad: ({ context }) => {
		if (!context.user) {
			throw new Error("Not authenticated");
		}
	},
	errorComponent: ({ error }) => {
		if (error.message === "Not authenticated") {
			return <Login />;
		}

		throw error;
	},
});
