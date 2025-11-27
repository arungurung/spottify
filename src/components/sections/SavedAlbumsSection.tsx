import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/components/motion/uiStore";
import { AlbumCard } from "@/components/spotify/AlbumCard";
import { AlbumListItem } from "@/components/spotify/AlbumListItem";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { SkeletonGrid } from "@/components/ui/LoadingSkeleton";
import { usePrefetch } from "@/hooks/usePrefetch";
import {
	albumDetailQueryOptions,
	savedAlbumsQueryOptions,
} from "@/utils/spotify-queries";

export function SavedAlbumsSection() {
	const { data, isLoading, error, refetch } = useQuery(
		savedAlbumsQueryOptions(),
	);
	const { openPanel } = useUIStore();
	const { prefetch, cancel } = usePrefetch();

	if (isLoading) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">Saved Albums</h2>
				<SkeletonGrid count={8} />
			</section>
		);
	}

	if (error) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">Saved Albums</h2>
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-sm text-red-800">
						Failed to load saved albums. {error.message}
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
				<h2 className="mb-4 text-2xl font-bold text-gray-800">Saved Albums</h2>
				<div className="rounded-lg bg-gray-100 p-8 text-center">
					<p className="text-gray-600">
						No saved albums. Save some albums on Spotify!
					</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<h2 className="mb-4 text-2xl font-bold text-gray-800">Saved Albums</h2>
			{/* List view for small screens */}
			<div className="flex flex-col gap-2 md:hidden">
				{data.items
					.filter((item) => item.album !== undefined)
					.map((item) => (
						<AlbumListItem
							key={item.album?.id}
							album={item.album as import("@/types/spotify").SpotifyAlbum}
							onClick={() => openPanel("album", item.album?.id as string)}
						/>
					))}
			</div>
			{/* Grid view for medium+ screens */}
			<div className="hidden grid-cols-3 gap-3 md:grid lg:grid-cols-4 xl:grid-cols-6">
				{data.items
					.filter((item) => item.album !== undefined)
					.map((item, index) => (
						<AnimatedCard
							key={item.album?.id}
							index={index}
							layoutId={`album-${item.album?.id}`}
							onClick={() => {
								performance.mark(`detail-open-${item.album?.id}`);
								openPanel("album", item.album?.id as string);
							}}
							onPrefetch={() =>
								prefetch(albumDetailQueryOptions(item.album?.id as string))
							}
							onCancelPrefetch={cancel}
						>
							<AlbumCard
								album={item.album as import("@/types/spotify").SpotifyAlbum}
							/>
						</AnimatedCard>
					))}
			</div>
		</section>
	);
}
