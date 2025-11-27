import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/components/motion/uiStore";
import ArtistCard from "@/components/spotify/ArtistCard";
import { ArtistListItem } from "@/components/spotify/ArtistListItem";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { SkeletonGrid } from "@/components/ui/LoadingSkeleton";
import { usePrefetch } from "@/hooks/usePrefetch";
import type { SpotifyTimeRange } from "@/types/spotify";
import {
	artistDetailQueryOptions,
	topArtistsQueryOptions,
} from "@/utils/spotify-queries";

export function TopArtistsSection({
	timeRange,
}: {
	timeRange: SpotifyTimeRange;
}) {
	const { data, isLoading, error, refetch } = useQuery(
		topArtistsQueryOptions(timeRange),
	);
	const { openPanel } = useUIStore();
	const { prefetch, cancel } = usePrefetch();

	if (isLoading) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Top Artists
				</h2>
				<SkeletonGrid count={10} />
			</section>
		);
	}

	if (error) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Top Artists
				</h2>
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-sm text-red-800">
						Failed to load top artists. {error.message}
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
					Your Top Artists
				</h2>
				<div className="rounded-lg bg-gray-100 p-8 text-center">
					<p className="text-gray-600">
						No top artists found. Start listening!
					</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<h2 className="mb-4 text-2xl font-bold text-gray-800">
				Your Top Artists
			</h2>
			{/* List view for small screens */}
			<div className="flex flex-col gap-2 md:hidden">
				{data.items.map((artist) => (
					<ArtistListItem
						key={artist.id}
						artist={artist}
						onClick={() => openPanel("artist", artist.id)}
					/>
				))}
			</div>
			{/* Grid view for medium+ screens */}
			<div className="hidden grid-cols-3 gap-3 md:grid lg:grid-cols-4 xl:grid-cols-6">
				{data.items.map((artist, index) => (
					<AnimatedCard
						key={artist.id}
						index={index}
						layoutId={`artist-${artist.id}`}
						onClick={() => {
							performance.mark(`detail-open-${artist.id}`);
							openPanel("artist", artist.id);
						}}
						onPrefetch={() => prefetch(artistDetailQueryOptions(artist.id))}
						onCancelPrefetch={cancel}
					>
						<ArtistCard artist={artist} />
					</AnimatedCard>
				))}
			</div>
		</section>
	);
}
