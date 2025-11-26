import { createServerFn } from "@tanstack/react-start";
import { tokenMiddleware } from "@/middlewares/token-middleware";
import type {
	SpotifyAlbum,
	SpotifyArtist,
	SpotifyCategory,
	SpotifyPaginatedResponse,
	SpotifyPlaylist,
	SpotifySavedItem,
	SpotifySearchResponse,
	SpotifyTimeRange,
	SpotifyTrack,
} from "@/types/spotify";

export async function spotifyFetch<T>(
	endpoint: string,
	accessToken: string,
	options?: RequestInit,
): Promise<T> {
	if (!accessToken) {
		throw new Error("No access token provided for Spotify API request");
	}

	const url = endpoint.startsWith("https://")
		? endpoint
		: `https://api.spotify.com/v1/${endpoint}`;

	const response = await fetch(url, {
		...options,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			...(options?.headers || {}),
		},
	});

	if (!response.ok) {
		let details: string | undefined;
		try {
			const errJson = await response.json();
			details = errJson?.error?.message || JSON.stringify(errJson);
		} catch {
			details = await response.text();
		}
		console.error(`Spotify API error (${response.status}):`, details);
		if (
			response.status === 403 &&
			(details || "").toLowerCase().includes("insufficient client scope")
		) {
			throw new Error(
				"Insufficient Spotify scope. Please log out and re-connect your account.",
			);
		}
		throw new Error(
			`Spotify API request failed: ${response.status} ${response.statusText}`,
		);
	}

	return response.json();
}

/**
 * Get user's top tracks
 * @param timeRange - short_term (4 weeks), medium_term (6 months), long_term (years)
 * @param limit - Number of items to return (max 50)
 */
export const getTopTracks = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator(
		(input: { timeRange?: SpotifyTimeRange; limit?: number } = {}) => ({
			timeRange: input.timeRange || "medium_term",
			limit: Math.min(input.limit || 20, 50),
		}),
	)
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		const params = new URLSearchParams({
			time_range: data.timeRange,
			limit: data.limit.toString(),
			offset: "0",
		});

		return spotifyFetch<SpotifyPaginatedResponse<SpotifyTrack>>(
			`/me/top/tracks?${params}`,
			accessToken,
		);
	});

/**
 * Get user's top artists
 * @param timeRange - short_term (4 weeks), medium_term (6 months), long_term (years)
 * @param limit - Number of items to return (max 50)
 */
export const getTopArtists = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator(
		(input: { timeRange?: SpotifyTimeRange; limit?: number } = {}) => ({
			timeRange: input.timeRange || "medium_term",
			limit: Math.min(input.limit || 20, 50),
		}),
	)
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		const params = new URLSearchParams({
			time_range: data.timeRange,
			limit: data.limit.toString(),
			offset: "0",
		});

		return spotifyFetch<SpotifyPaginatedResponse<SpotifyArtist>>(
			`/me/top/artists?${params}`,
			accessToken,
		);
	});

/**
 * Get user's playlists
 * @param limit - Number of items to return (max 50)
 * @param offset - Index of first item to return
 */
export const getUserPlaylists = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((input: { limit?: number; offset?: number } = {}) => ({
		limit: Math.min(input.limit || 20, 50),
		offset: input.offset || 0,
	}))
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		const params = new URLSearchParams({
			limit: data.limit.toString(),
			offset: data.offset.toString(),
		});

		return spotifyFetch<SpotifyPaginatedResponse<SpotifyPlaylist>>(
			`/me/playlists?${params}`,
			accessToken,
		);
	});

/**
 * Get user's saved albums
 * @param limit - Number of items to return (max 50)
 * @param offset - Index of first item to return
 */
export const getSavedAlbums = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((input: { limit?: number; offset?: number } = {}) => ({
		limit: Math.min(input.limit || 20, 50),
		offset: input.offset || 0,
	}))
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		const params = new URLSearchParams({
			limit: data.limit.toString(),
			offset: data.offset.toString(),
		});

		return spotifyFetch<
			SpotifyPaginatedResponse<SpotifySavedItem<SpotifyAlbum>>
		>(`/me/albums?${params}`, accessToken);
	});

/**
 * Get user's recently played tracks
 * @param limit - Number of items to return (max 50)
 */
export const getRecentlyPlayed = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((input: { limit?: number } = {}) => ({
		limit: Math.min(input.limit || 20, 50),
	}))
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		const params = new URLSearchParams({
			limit: data.limit.toString(),
		});

		interface RecentlyPlayedResponse {
			items: Array<{
				track: SpotifyTrack;
				played_at: string;
				context: {
					type: string;
					uri: string;
				} | null;
			}>;
			next: string | null;
			cursors: {
				after: string;
				before: string;
			};
		}

		return spotifyFetch<RecentlyPlayedResponse>(
			`/me/player/recently-played?${params}`,
			accessToken,
		);
	});

/**
 * Search Spotify catalog
 * @param query - Search query string
 * @param types - Array of types to search (track, artist, album, playlist)
 * @param limit - Number of results per type (max 50)
 */
export const searchSpotify = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator(
		(input: {
			query: string;
			types?: Array<"track" | "artist" | "album" | "playlist">;
			limit?: number;
		}) => ({
			query: input.query.trim(),
			types: input.types || ["track", "artist", "album", "playlist"],
			limit: Math.min(input.limit || 20, 50),
		}),
	)
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		if (!data.query) {
			return {
				tracks: {
					items: [],
					total: 0,
					limit: 0,
					offset: 0,
					next: null,
					previous: null,
				},
				artists: {
					items: [],
					total: 0,
					limit: 0,
					offset: 0,
					next: null,
					previous: null,
				},
				albums: {
					items: [],
					total: 0,
					limit: 0,
					offset: 0,
					next: null,
					previous: null,
				},
				playlists: {
					items: [],
					total: 0,
					limit: 0,
					offset: 0,
					next: null,
					previous: null,
				},
			};
		}

		const params = new URLSearchParams({
			q: data.query,
			type: data.types.join(","),
			limit: data.limit.toString(),
			offset: "0",
		});

		return spotifyFetch<SpotifySearchResponse>(
			`/search?${params}`,
			accessToken,
		);
	});

/**
 * Get browse categories
 * @param limit - Number of items to return (max 50)
 * @param offset - Index of first item to return
 */
export const getBrowseCategories = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((input: { limit?: number; offset?: number } = {}) => ({
		limit: Math.min(input.limit || 20, 50),
		offset: input.offset || 0,
	}))
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		const params = new URLSearchParams({
			limit: data.limit.toString(),
			offset: data.offset.toString(),
		});

		interface CategoriesResponse {
			categories: SpotifyPaginatedResponse<SpotifyCategory>;
		}

		return spotifyFetch<CategoriesResponse>(
			`/browse/categories?${params}`,
			accessToken,
		);
	});

/**
 * Get playlists for a specific category
 * @param categoryId - Spotify category ID
 * @param limit - Number of items to return (max 50)
 */
export const getCategoryPlaylists = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator(
		(input: { categoryId: string; limit?: number; offset?: number }) => ({
			categoryId: input.categoryId,
			limit: Math.min(input.limit || 20, 50),
			offset: input.offset || 0,
		}),
	)
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		const params = new URLSearchParams({
			limit: data.limit.toString(),
			offset: data.offset.toString(),
		});

		interface CategoryPlaylistsResponse {
			playlists: SpotifyPaginatedResponse<SpotifyPlaylist>;
		}

		return spotifyFetch<CategoryPlaylistsResponse>(
			`/browse/categories/${data.categoryId}/playlists?${params}`,
			accessToken,
		);
	});

// Detail endpoints for entity panel
export const getTrackByIdFn = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((id: string) => id)
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		return spotifyFetch<SpotifyTrack>(`/tracks/${data}`, accessToken);
	});

export const getArtistByIdFn = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((id: string) => id)
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		return spotifyFetch<SpotifyArtist>(`/artists/${data}`, accessToken);
	});

export const getAlbumByIdFn = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((id: string) => id)
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		return spotifyFetch<SpotifyAlbum>(`/albums/${data}`, accessToken);
	});

export const getPlaylistByIdFn = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((id: string) => id)
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		return spotifyFetch<SpotifyPlaylist>(`/playlists/${data}`, accessToken);
	});

export const getPlaylistTracksFn = createServerFn({ method: "GET" })
	.middleware([tokenMiddleware])
	.inputValidator((input: { id: string; limit?: number; offset?: number }) => ({
		id: input.id,
		limit: Math.min(input.limit ?? 10, 50),
		offset: input.offset ?? 0,
	}))
	.handler(async ({ data, context }) => {
		const accessToken = context.session.data.accessToken;
		if (!accessToken) {
			throw new Error("No access token available");
		}
		const params = new URLSearchParams({
			limit: String(data.limit),
			offset: String(data.offset),
		});
		return spotifyFetch<SpotifyPaginatedResponse<{ track: SpotifyTrack }>>(
			`/playlists/${data.id}/tracks?${params}`,
			accessToken,
		);
	});
