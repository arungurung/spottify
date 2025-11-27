import type { SpotifyAlbum } from "@/types/spotify";

interface AlbumListItemProps {
	album: SpotifyAlbum;
	onClick?: (album: SpotifyAlbum) => void;
}

export function AlbumListItem({ album, onClick }: AlbumListItemProps) {
	const albumImage = album.images[0]?.url;
	const artists = album.artists.map((a) => a.name).join(", ");

	return (
		<button
			type="button"
			onClick={() => onClick?.(album)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.(album);
				}
			}}
			aria-haspopup="dialog"
			className="group flex w-full items-center gap-3 rounded-lg bg-white p-2 shadow transition-all hover:shadow-md"
		>
			{albumImage && (
				<img
					src={albumImage}
					alt={album.name}
					className="aspect-square h-12 w-12 shrink-0 rounded-md object-cover"
				/>
			)}
			<div className="min-w-0 flex-1 text-left">
				<h3
					className="truncate text-sm font-semibold leading-tight text-gray-900"
					title={album.name}
				>
					{album.name}
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
