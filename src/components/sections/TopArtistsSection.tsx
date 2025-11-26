import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/components/motion/uiStore";
import ArtistCard from "@/components/spotify/ArtistCard";
import type { SpotifyTimeRange } from "@/types/spotify";
import { topArtistsQueryOptions } from "@/utils/spotify-queries";
import { LoadingGrid } from "./LoadingGrid";

export function TopArtistsSection({
	timeRange,
}: {
	timeRange: SpotifyTimeRange;
}) {
	const { data, isLoading, error, refetch } = useQuery(
		topArtistsQueryOptions(timeRange),
	);
	const { openPanel } = useUIStore();

	if (isLoading) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">
					Your Top Artists
				</h2>
				<LoadingGrid />
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
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{data.items.map((artist) => (
					<ArtistCard
						key={artist.id}
						artist={artist}
						onClick={(a) => openPanel("artist", a.id)}
					/>
				))}
			</div>
		</section>
	);
}
