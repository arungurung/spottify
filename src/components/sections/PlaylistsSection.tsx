import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/components/motion/uiStore";
import { PlaylistCard } from "@/components/spotify/PlaylistCard";
import { PlaylistListItem } from "@/components/spotify/PlaylistListItem";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { SkeletonGrid } from "@/components/ui/LoadingSkeleton";
import { usePrefetch } from "@/hooks/usePrefetch";
import {
	playlistDetailQueryOptions,
	userPlaylistsQueryOptions,
} from "@/utils/spotify-queries";

export function PlaylistsSection() {
	const { data, isLoading, error, refetch } = useQuery(
		userPlaylistsQueryOptions(),
	);
	const { openPanel } = useUIStore();
	const { prefetch, cancel } = usePrefetch();

	if (isLoading) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Playlists
				</h2>
				<SkeletonGrid count={8} />
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
			{/* List view for small screens */}
			<div className="flex flex-col gap-2 md:hidden">
				{data.items.map((playlist) => (
					<PlaylistListItem
						key={playlist.id}
						playlist={playlist}
						onClick={() => openPanel("playlist", playlist.id)}
					/>
				))}
			</div>
			{/* Grid view for medium+ screens */}
			<div className="hidden grid-cols-3 gap-3 md:grid lg:grid-cols-4 xl:grid-cols-6">
				{data.items.map((playlist, index) => (
					<AnimatedCard
						key={playlist.id}
						index={index}
						layoutId={`playlist-${playlist.id}`}
						onClick={() => {
							performance.mark(`detail-open-${playlist.id}`);
							openPanel("playlist", playlist.id);
						}}
						onPrefetch={() => prefetch(playlistDetailQueryOptions(playlist.id))}
						onCancelPrefetch={cancel}
					>
						<PlaylistCard playlist={playlist} />
					</AnimatedCard>
				))}
			</div>
		</section>
	);
}
