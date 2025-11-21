import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import { fetchUser } from "@/utils/fetchUser";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
	user: { email: string } | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		const user = await fetchUser();
		return { user };
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootComponent,
	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		);
	},
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const { user } = Route.useRouteContext();

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<header className="p-2 flex gap-2 text-lg">
					<Link
						to="/"
						activeProps={{ className: "font-bold" }}
						activeOptions={{ exact: true }}
					>
						Home
					</Link>{" "}
					<Link to="/posts" activeProps={{ className: "font-bold" }}>
						Posts
					</Link>
					<div className="ml-auto">
						{user ? (
							<>
								<span className="mr-2">{user.email}</span>
								<Link to="/logout">Logout</Link>
							</>
						) : (
							<Link to="/login">Login</Link>
						)}
					</div>
				</header>
				<hr />
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
