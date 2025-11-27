import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/components/motion/uiStore";
import TrackCard from "@/components/spotify/TrackCard";
import { TrackListItem } from "@/components/spotify/TrackListItem";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { SkeletonGrid } from "@/components/ui/LoadingSkeleton";
import { usePrefetch } from "@/hooks/usePrefetch";
import type { SpotifyTimeRange } from "@/types/spotify";
import {
	topTracksQueryOptions,
	trackDetailQueryOptions,
} from "@/utils/spotify-queries";

export function TopTracksSection({
	timeRange,
}: {
	timeRange: SpotifyTimeRange;
}) {
	const { data, isLoading, error, refetch } = useQuery(
		topTracksQueryOptions(timeRange),
	);
	const { openPanel } = useUIStore();
	const { prefetch, cancel } = usePrefetch();

	if (isLoading) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Top Tracks
				</h2>
				<SkeletonGrid count={10} />
			</section>
		);
	}

	if (error) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Top Tracks
				</h2>
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-sm text-red-800">
						Failed to load top tracks. {error.message}
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
					Your Top Tracks
				</h2>
				<div className="rounded-lg bg-gray-100 p-8 text-center">
					<p className="text-gray-600">No top tracks found. Start listening!</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<h2 className="mb-4 text-2xl font-bold text-gray-800">Your Top Tracks</h2>
			{/* List view for small screens */}
			<div className="flex flex-col gap-2 md:hidden">
				{data.items.map((track) => (
					<TrackListItem
						key={track.id}
						track={track}
						onClick={() => openPanel("track", track.id)}
					/>
				))}
			</div>
			{/* Grid view for medium+ screens */}
			<div className="hidden grid-cols-3 gap-3 md:grid lg:grid-cols-4 xl:grid-cols-6">
				{data.items.map((track, index) => (
					<AnimatedCard
						key={track.id}
						index={index}
						layoutId={`track-${track.id}`}
						onClick={() => {
							performance.mark(`detail-open-${track.id}`);
							openPanel("track", track.id);
						}}
						onPrefetch={() => prefetch(trackDetailQueryOptions(track.id))}
						onCancelPrefetch={cancel}
					>
						<TrackCard track={track} />
					</AnimatedCard>
				))}
			</div>
		</section>
	);
}
