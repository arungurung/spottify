import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/components/motion/uiStore";
import { AlbumCard } from "@/components/spotify/AlbumCard";
import { savedAlbumsQueryOptions } from "@/utils/spotify-queries";
import { LoadingGrid } from "./LoadingGrid";

export function SavedAlbumsSection() {
	const { data, isLoading, error, refetch } = useQuery(
		savedAlbumsQueryOptions(),
	);
	const { openPanel } = useUIStore();

	if (isLoading) {
		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold text-gray-800">Saved Albums</h2>
				<LoadingGrid columns="reduced" />
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
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{data.items
					.filter((item) => item.album !== undefined)
					.map((item) => (
						<AlbumCard
							key={item.album?.id}
							album={item.album as import("@/types/spotify").SpotifyAlbum}
							onClick={(a) => openPanel("album", a.id)}
						/>
					))}
			</div>
		</section>
	);
}
