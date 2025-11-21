import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import Auth from "@/components/Auth";
import { useMutation } from "@/hooks/useMutation";
import User from "@/lib/models/user";
import { hashPassword } from "@/utils/password";
import { useAppSession } from "@/utils/session";

export const signupFn = createServerFn({ method: "POST" })
	.inputValidator(
		(d: {
			email: string;
			password: string;
			fullName: string;
			redirectUrl?: string;
		}) => d,
	)
	.handler(async ({ data }) => {
		// check if the user already exists
		const found = await User.findOne({ email: data.email });

		// Encrypt the password using Sha256 into plain text
		const hashedPassword = await hashPassword(data.password);

		// create session
		const session = await useAppSession();

		if (found) {
			if (found.password !== hashedPassword) {
				return {
					error: true,
					userExists: true,
					message: "User already exists",
				};
			}

			// store the user's email in the session
			await session.update({
				userEmail: found.email,
			});

			// redirect to the prev page stored in the redirect search param
			throw redirect({
				href: data.redirectUrl || "/",
			});
		}

		// Create the user
		const user = await User.create({
			email: data.email,
			fullName: data.fullName,
			password: hashedPassword,
		});

		// store the user's email in the session
		await session.update({
			userEmail: user.email,
		});

		// redirect to the prev page stored in the redirect search param
		throw redirect({
			href: data.redirectUrl || "/",
		});
	});

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const signupMutation = useMutation({
		fn: useServerFn(signupFn),
	});

	return (
		<Auth
			actionText="Sign Up"
			status={signupMutation.status}
			onSubmit={(e) => {
				const formData = new FormData(e.target as HTMLFormElement);

				signupMutation.mutate({
					data: {
						email: formData.get("email") as string,
						password: formData.get("password") as string,
						fullName: formData.get("fullName") as string,
					},
				});
			}}
			afterSubmit={
				signupMutation.data?.error ? (
					<div className="text-red-400">{signupMutation.data.message}</div>
				) : null
			}
		/>
	);
}
