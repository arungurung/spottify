import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import DefaultCatchBoundary from "./components/DefaultCatchBoundary";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const router = createRouter({
		routeTree,
		context: { ...rqContext, user: null },
		defaultPreload: "intent",
		Wrap: (props: { children: React.ReactNode }) => {
			return (
				<TanstackQuery.Provider {...rqContext}>
					{props.children}
				</TanstackQuery.Provider>
			);
		},
		defaultNotFoundComponent() {
			return <div>404: Page Not Found</div>;
		},
		defaultErrorComponent: DefaultCatchBoundary,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	return router;
};
