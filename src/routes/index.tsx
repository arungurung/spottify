import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import SpotifyIcon from "@/assets/spotify.svg?react";
import { initiateSpotifyAuth } from "@/utils/spotify";

type IndexSearch = {
	error?: string;
};

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>): IndexSearch => {
		return { error: search.error as string | undefined };
	},
	component: IndexComponent,
	beforeLoad: ({ context }) => {
		if (context.user) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

function IndexComponent() {
	const { error } = Route.useSearch();
	const getAuthUrl = useServerFn(initiateSpotifyAuth);

	const handleLogin = async () => {
		try {
			const result = await getAuthUrl();
			window.location.href = result.authUrl;
		} catch (err) {
			console.error("Failed to initiate Spotify auth:", err);
		}
	};

	const errorMessages: Record<string, string> = {
		auth_failed: "Authentication with Spotify failed. Please try again.",
		spotify_rejected: "You rejected the Spotify authorization request.",
		no_code: "No authorization code received from Spotify.",
		callback_failed: "Failed to process Spotify callback. Please try again.",
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-400 to-blue-500">
			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-4xl font-bold text-gray-800">Spottify</h1>
					<p className="text-gray-600">Connect with your Spotify account</p>
				</div>

				{error && (
					<div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
						<p className="text-sm text-red-800">
							{errorMessages[error] || "An error occurred. Please try again."}
						</p>
					</div>
				)}

				<button
					onClick={handleLogin}
					className="w-full flex items-center justify-center rounded-lg bg-green-500 py-3 px-4 text-white font-semibold transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					type="button"
				>
					<SpotifyIcon className="mr-2 h-6 w-6" /> Login with Spotify
				</button>
			</div>
		</div>
	);
}
