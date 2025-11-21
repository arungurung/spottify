import type React from "react";
import { useId } from "react";

const Auth = ({
	actionText,
	onSubmit,
	status,
	afterSubmit,
}: {
	actionText: "Login" | "Sign Up";
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	status: "pending" | "idle" | "error" | "success";
	afterSubmit?: React.ReactNode;
}) => {
	const emailId = useId();
	const passwordId = useId();
	const fullNameId = useId();

	return (
		<div className="fixed inset-0 bg-white flex items-start justify-center p-8">
			<div className="bg-white p-8 rounded-lg shadow-lg">
				<h1 className="text-2xl font-bold mb-4">{actionText}</h1>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit(e);
					}}
					className="space-y-4"
				>
					{actionText === "Sign Up" && (
						<div>
							<label htmlFor={fullNameId} className="block text-xs">
								Full Name
							</label>
							<input
								type="text"
								name="fullName"
								id={fullNameId}
								className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white"
							/>
						</div>
					)}
					<div>
						<label htmlFor={emailId} className="block text-xs">
							Email
						</label>
						<input
							type="email"
							name="email"
							id={emailId}
							className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white"
						/>
					</div>
					<div>
						<label htmlFor={passwordId} className="block text-xs">
							Password
						</label>
						<input
							type="password"
							name="password"
							id={passwordId}
							className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-cyan-600 text-white rounded-sm py-2 font-black uppercase"
						disabled={status === "pending"}
					>
						{status === "pending" ? "..." : actionText}
					</button>
					{afterSubmit ? afterSubmit : null}
				</form>
			</div>
		</div>
	);
};

export default Auth;
