import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Signup will be replaced with Spotify OAuth</div>;
}
