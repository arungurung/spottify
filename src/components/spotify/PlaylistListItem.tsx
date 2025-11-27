import type { SpotifyPlaylist } from "@/types/spotify";

interface PlaylistListItemProps {
	playlist: SpotifyPlaylist;
	onClick?: (playlist: SpotifyPlaylist) => void;
}

export function PlaylistListItem({ playlist, onClick }: PlaylistListItemProps) {
	const playlistImage = playlist.images[0]?.url;

	return (
		<button
			type="button"
			onClick={() => onClick?.(playlist)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.(playlist);
				}
			}}
			aria-haspopup="dialog"
			className="group flex w-full items-center gap-3 rounded-lg bg-white p-2 shadow transition-all hover:shadow-md"
		>
			{playlistImage ? (
				<img
					src={playlistImage}
					alt={playlist.name}
					className="aspect-square h-12 w-12 shrink-0 rounded-md object-cover"
				/>
			) : (
				<div className="flex aspect-square h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gray-200">
					<span className="text-xl text-gray-400">🎵</span>
				</div>
			)}
			<div className="min-w-0 flex-1 text-left">
				<h3
					className="truncate text-sm font-semibold leading-tight text-gray-900"
					title={playlist.name}
				>
					{playlist.name}
				</h3>
				<p className="truncate text-xs leading-tight text-gray-600">
					{playlist.owner.display_name}
				</p>
			</div>
		</button>
	);
}
