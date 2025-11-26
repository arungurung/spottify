import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlaylistsSection } from "@/components/sections/PlaylistsSection";
import { RecentlyPlayedSection } from "@/components/sections/RecentlyPlayedSection";
import { SavedAlbumsSection } from "@/components/sections/SavedAlbumsSection";
import { TopArtistsSection } from "@/components/sections/TopArtistsSection";
import { TopTracksSection } from "@/components/sections/TopTracksSection";
import { DashboardTabs } from "@/components/ui/DashboardTabs";
import type { SpotifyTimeRange } from "@/types/spotify";
import {
	recentlyPlayedQueryOptions,
	savedAlbumsQueryOptions,
	topArtistsQueryOptions,
	topTracksQueryOptions,
	userPlaylistsQueryOptions,
} from "@/utils/spotify-queries";

export const Route = createFileRoute("/_authed/dashboard/")({
	ssr: "data-only",
	component: RouteComponent,
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.prefetchQuery(topTracksQueryOptions()),
			context.queryClient.prefetchQuery(topArtistsQueryOptions()),
			context.queryClient.prefetchQuery(recentlyPlayedQueryOptions()),
			context.queryClient.prefetchQuery(userPlaylistsQueryOptions()),
			context.queryClient.prefetchQuery(savedAlbumsQueryOptions()),
		]);
	},
});

function RouteComponent() {
	const [timeRange, setTimeRange] = useState<SpotifyTimeRange>("medium_term");

	const tabs = [
		{ id: "short_term", label: "Last 4 Weeks" },
		{ id: "medium_term", label: "Last 6 Months" },
		{ id: "long_term", label: "All Time" },
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900">Your Dashboard</h1>
					<p className="mt-2 text-gray-600">
						Discover your music taste and explore Spotify
					</p>
					<div className="mt-4">
						<DashboardTabs
							tabs={tabs}
							activeId={timeRange}
							onChange={(id) => setTimeRange(id as SpotifyTimeRange)}
						/>
					</div>
				</div>
				<TopTracksSection timeRange={timeRange} />
				<TopArtistsSection timeRange={timeRange} />
				<RecentlyPlayedSection />
				<PlaylistsSection />
				<SavedAlbumsSection />
			</div>
		</div>
	);
}
