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
import { Cog } from "lucide-react";
import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import type { SessionUser } from "@/utils/session";
import { getCurrentUserFn } from "@/utils/spotify";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
	user: SessionUser | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		const user = await getCurrentUserFn();
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
					<div className="ml-auto flex items-center">
						{user ? (
							<>
								<span className="mr-2">{user.displayName}</span>
								<Link to="/user/settings" className="mr-2">
									<Cog />
								</Link>
								<Link to="/logout">Logout</Link>
							</>
						) : (
							<Link to="/login">Login</Link>
						)}
					</div>
					<hr />
				</header>
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
