import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { env } from "@/env";
import { getAppSession } from "./session";

export interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
	scope: string;
}

export interface SpotifyUserProfile {
	id: string;
	display_name: string;
	email?: string;
	images?: Array<{ url: string }>;
}

export const initiateSpotifyAuth = createServerFn({
	method: "GET",
}).handler(async () => {
	const scopes = [
		"user-read-email",
		"user-read-private",
		"user-library-read",
		"user-top-read",
		"playlist-read-private",
	];

	const params = new URLSearchParams({
		client_id: env.SPOTIFY_CLIENT_ID,
		response_type: "code",
		redirect_uri: env.SPOTIFY_REDIRECT_URI,
		scope: scopes.join(" "),
		show_dialog: "false",
	});

	const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
	return { authUrl };
});

export const handleSpotifyCallback = createServerFn({
	method: "GET",
})
	.inputValidator((code: string) => code)
	.handler(async ({ data: code }) => {
		try {
			const tokenResponse = await fetch(
				"https://accounts.spotify.com/api/token",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
					},
					body: new URLSearchParams({
						grant_type: "authorization_code",
						code: code,
						redirect_uri: env.SPOTIFY_REDIRECT_URI,
					}),
				},
			);

			if (!tokenResponse.ok) {
				const error = await tokenResponse.text();
				console.error("Token exchange failed:", error);
				throw new Error("Failed to exchange authorization code");
			}

			const tokens: SpotifyTokenResponse = await tokenResponse.json();

			const profileResponse = await fetch("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
				},
			});

			if (!profileResponse.ok) {
				const error = await profileResponse.text();
				console.error("Fetching profile failed:", error);
				throw new Error("Failed to fetch user profile");
			}

			const profile: SpotifyUserProfile = await profileResponse.json();

			const session = await getAppSession();
			const expiresAt = Date.now() + tokens.expires_in * 1000;

			await session.update({
				spotifyId: profile.id,
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
				expiresAt,
				displayName: profile.display_name || profile.email || "Spotify User",
			});
		} catch (error) {
			console.error("Spotify callback error:", error);
			throw redirect({ to: "/", search: { error: "auth_failed" } });
		}

		throw redirect({ to: "/dashboard" });
	});

export const refreshSpotifyToken = createServerFn({
	method: "POST",
})
	.inputValidator((refreshToken: string) => refreshToken)
	.handler(async ({ data: refreshToken }) => {
		try {
			const response = await fetch("https://accounts.spotify.com/api/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
				},
				body: new URLSearchParams({
					grant_type: "refresh_token",
					refresh_token: refreshToken,
				}),
			});

			if (!response.ok) {
				const error = await response.text();
				console.error("Token refresh failed:", error);
				throw new Error("Failed to refresh access token");
			}

			const tokens: Omit<SpotifyTokenResponse, "refresh_token"> =
				await response.json();

			const expiresAt = Date.now() + tokens.expires_in * 1000;

			return {
				accessToken: tokens.access_token,
				expiresAt,
			};
		} catch (error) {
			console.error("Token refresh error:", error);
			throw error;
		}
	});

export const getCurrentUserFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const session = await getAppSession();
	const sessionData = session.data;

	if (!sessionData.spotifyId || !sessionData.accessToken) {
		return null;
	}

	const now = Date.now();
	const expiresAt = sessionData.expiresAt || 0;
	const isExpired = now >= expiresAt;

	if (isExpired && sessionData.refreshToken) {
		try {
			console.info("Access token expired, refreshing...");
			const { accessToken, expiresAt: newExpiresAt } =
				await refreshSpotifyToken({
					data: sessionData.refreshToken,
				});

			await session.update({
				...sessionData,
				accessToken,
				expiresAt: newExpiresAt,
			});

			console.info("Access token refreshed successfully.");

			return {
				...sessionData,
				accessToken,
				expiresAt: newExpiresAt,
			};
		} catch (error) {
			console.error("Failed to refresh access token:", error);
			await session.clear();
			return null;
		}
	}

	return sessionData;
});
