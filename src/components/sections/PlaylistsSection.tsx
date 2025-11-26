import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/components/motion/uiStore";
import { PlaylistCard } from "@/components/spotify/PlaylistCard";
import { userPlaylistsQueryOptions } from "@/utils/spotify-queries";
import { LoadingGrid } from "./LoadingGrid";

export function PlaylistsSection() {
	const { data, isLoading, error, refetch } = useQuery(
		userPlaylistsQueryOptions(),
	);
	const { openPanel } = useUIStore();

	if (isLoading) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Playlists
				</h2>
				<LoadingGrid columns="reduced" />
			</section>
		);
	}

	if (error) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Playlists
				</h2>
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-sm text-red-800">
						Failed to load playlists. {error.message}
					</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="mt-2 text-sm font-semibold text-red-600 hover:text-red-800"
					>
						Try again
					</button>
				</div>
			</section>
		);
	}

	if (!data?.items || data.items.length === 0) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Playlists
				</h2>
				<div className="rounded-lg bg-gray-100 p-8 text-center">
					<p className="text-gray-600">
						No playlists found. Create one on Spotify!
					</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<h2 className="mb-4 text-2xl font-bold text-gray-800">Your Playlists</h2>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{data.items.map((playlist) => (
					<PlaylistCard
						key={playlist.id}
						playlist={playlist}
						onClick={(p) => openPanel("playlist", p.id)}
					/>
				))}
			</div>
		</section>
	);
}
