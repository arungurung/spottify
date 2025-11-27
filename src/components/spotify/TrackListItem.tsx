import type { SpotifyTrack } from "@/types/spotify";

interface TrackListItemProps {
	track: SpotifyTrack;
	onClick?: (track: SpotifyTrack) => void;
}

export function TrackListItem({ track, onClick }: TrackListItemProps) {
	const albumImage = track.album.images[0]?.url;
	const artists = track.artists.map((artist) => artist.name).join(", ");

	return (
		<button
			type="button"
			className="group flex w-full items-center gap-3 rounded-lg bg-white p-2 shadow transition-all hover:shadow-md"
			onClick={() => onClick?.(track)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.(track);
				}
			}}
			aria-haspopup="dialog"
		>
			{albumImage && (
				<img
					src={albumImage}
					alt={track.name}
					className="aspect-square h-12 w-12 shrink-0 rounded-md object-cover"
				/>
			)}
			<div className="min-w-0 flex-1 text-left">
				<h3
					className="truncate text-sm font-semibold leading-tight text-gray-900"
					title={track.name}
				>
					{track.name}
				</h3>
				<p
					className="truncate text-xs leading-tight text-gray-600"
					title={artists}
				>
					{artists}
				</p>
			</div>
		</button>
	);
}
