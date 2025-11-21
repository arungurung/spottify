import { Link, useRouter } from "@tanstack/react-router";
import { useMutation } from "@/hooks/useMutation";
import { loginFn } from "@/routes/_authed";
import Auth from "./Auth";

const Login = () => {
	const router = useRouter();

	const loginMutation = useMutation({
		fn: loginFn,
		onSuccess: async (ctx) => {
			if (!ctx.data?.error) {
				await router.invalidate();
				router.navigate({ to: "/" });
				return;
			}
		},
	});

	return (
		<Auth
			actionText="Login"
			status={loginMutation.status}
			onSubmit={(e) => {
				const formData = new FormData(e.target as HTMLFormElement);

				loginMutation.mutate({
					data: {
						email: formData.get("email") as string,
						password: formData.get("password") as string,
					},
				});
			}}
			afterSubmit={
				loginMutation.data ? (
					<>
						<div className="text-red-400">{loginMutation.data.message}</div>
						{loginMutation.data.userNotFound ? (
							<div>
								<Link className="text-blue-500" to="/signup">
									Sign up instead?
								</Link>
							</div>
						) : null}
					</>
				) : null
			}
		/>
	);
};

export default Login;
