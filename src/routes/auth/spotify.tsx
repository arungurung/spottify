import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { handleSpotifyCallback } from "@/utils/spotify";

type SpotifyCallbackSearch = {
	code?: string;
	error?: string;
};

export const Route = createFileRoute("/auth/spotify")({
	validateSearch: (search: Record<string, unknown>): SpotifyCallbackSearch => {
		return {
			code: search.code as string | undefined,
			error: search.error as string | undefined,
		};
	},
	component: SpotifyCallbackComponent,
});

function SpotifyCallbackComponent() {
	const { code, error } = Route.useSearch();
	const navigate = Route.useNavigate();
	const handleCallback = useServerFn(handleSpotifyCallback);

	useEffect(() => {
		const processCallback = async () => {
			if (error) {
				console.error("Spotify OAuth error:", error);
				navigate({
					to: "/",
					search: { error: "spotify_rejected" },
				});
				return;
			}

			if (!code) {
				console.error("No authorization code received");
				navigate({
					to: "/",
					search: { error: "no_code" },
				});
				return;
			}

			try {
				await handleCallback({ data: code });
			} catch (err) {
				console.error("Callback processing error:", err);
				navigate({
					to: "/",
					search: { error: "callback_failed" },
				});
			}
		};

		processCallback();
	}, [code, error, handleCallback, navigate]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<div className="mb-4 text-xl font-semibold">
					{error ? "Authentication Failed" : "Authenticating with Spotify..."}
				</div>
				{!error && (
					<div className="text-gray-600">
						Please wait while we complete your login
					</div>
				)}
			</div>
		</div>
	);
}
