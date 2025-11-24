import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/user/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	// const updateProfilePictureMutation = useMutation({
	// 	fn: updateProfilePicture,
	// });

	return <div>Handle some user settings here</div>;
}
