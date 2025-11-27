import type { SpotifyArtist } from "@/types/spotify";

interface ArtistListItemProps {
	artist: SpotifyArtist;
	onClick?: (artist: SpotifyArtist) => void;
}

export function ArtistListItem({ artist, onClick }: ArtistListItemProps) {
	const artistImage = artist.images?.[0]?.url;

	return (
		<button
			type="button"
			className="group flex w-full items-center gap-3 rounded-lg bg-white p-2 shadow transition-all hover:shadow-md"
			onClick={() => onClick?.(artist)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.(artist);
				}
			}}
			aria-haspopup="dialog"
		>
			{artistImage ? (
				<img
					src={artistImage}
					alt={artist.name}
					className="aspect-square h-12 w-12 shrink-0 rounded-full object-cover"
				/>
			) : (
				<div className="flex aspect-square h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200">
					<span className="text-xl text-gray-400">🎤</span>
				</div>
			)}
			<div className="min-w-0 flex-1 text-left">
				<h3
					className="truncate text-sm font-semibold leading-tight text-gray-900"
					title={artist.name}
				>
					{artist.name}
				</h3>
				{artist.followers && (
					<p className="truncate text-xs leading-tight text-gray-600">
						{artist.followers.total.toLocaleString()} followers
					</p>
				)}
			</div>
		</button>
	);
}
