import { queryOptions } from "@tanstack/react-query";
import type { SpotifyTimeRange } from "@/types/spotify";
import {
	getAlbumByIdFn,
	getArtistByIdFn,
	getPlaylistByIdFn,
	getPlaylistTracksFn,
	getRecentlyPlayed,
	getSavedAlbums,
	getTopArtists,
	getTopTracks,
	getTrackByIdFn,
	getUserPlaylists,
} from "./spotify-api";

export const topTracksQueryOptions = (
	timeRange: SpotifyTimeRange = "medium_term",
	limit = 20,
) =>
	queryOptions({
		queryKey: ["top-tracks", timeRange, limit],
		queryFn: () =>
			getTopTracks({
				data: { timeRange, limit },
			}),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

export const topArtistsQueryOptions = (
	timeRange: SpotifyTimeRange = "medium_term",
	limit = 20,
) =>
	queryOptions({
		queryKey: ["top-artists", timeRange, limit],
		queryFn: () =>
			getTopArtists({
				data: { timeRange, limit },
			}),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

export const recentlyPlayedQueryOptions = (limit = 20) =>
	queryOptions({
		queryKey: ["recently-played", limit],
		queryFn: () =>
			getRecentlyPlayed({
				data: { limit },
			}),
		staleTime: 1000 * 60, // 1 minute (more recent data)
	});

export const userPlaylistsQueryOptions = (limit = 20, offset = 0) =>
	queryOptions({
		queryKey: ["user-playlists", limit, offset],
		queryFn: () =>
			getUserPlaylists({
				data: { limit, offset },
			}),
		staleTime: 1000 * 60 * 10, // 10 minutes
	});

export const savedAlbumsQueryOptions = (limit = 20, offset = 0) =>
	queryOptions({
		queryKey: ["saved-albums", limit, offset],
		queryFn: () =>
			getSavedAlbums({
				data: { limit, offset },
			}),
		staleTime: 1000 * 60 * 10, // 10 minutes
	});

export const trackDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["track-detail", id],
		queryFn: () => getTrackByIdFn({ data: id }),
		staleTime: 1000 * 60 * 30,
	});

export const artistDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["artist-detail", id],
		queryFn: () => getArtistByIdFn({ data: id }),
		staleTime: 1000 * 60 * 30,
	});

export const albumDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["album-detail", id],
		queryFn: () => getAlbumByIdFn({ data: id }),
		staleTime: 1000 * 60 * 30,
	});

export const playlistDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["playlist-detail", id],
		queryFn: () => getPlaylistByIdFn({ data: id }),
		staleTime: 1000 * 60 * 30,
	});

export const playlistTracksQueryOptions = (
	id: string,
	limit = 10,
	offset = 0,
) =>
	queryOptions({
		queryKey: ["playlist-tracks", id, limit, offset],
		queryFn: () => getPlaylistTracksFn({ data: { id, limit, offset } }),
		staleTime: 1000 * 30,
	});
