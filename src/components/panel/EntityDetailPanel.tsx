import { useQuery } from "@tanstack/react-query";
import { useEffect, useId, useRef, useState } from "react";
import { Motion, useReducedMotion } from "@/components/motion/MotionProvider";
import { useUIStore } from "@/components/motion/uiStore";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import {
	albumDetailQueryOptions,
	artistDetailQueryOptions,
	playlistDetailQueryOptions,
	playlistTracksQueryOptions,
	trackDetailQueryOptions,
} from "@/utils/spotify-queries";

function useMediaQuery(query: string) {
	if (typeof window === "undefined") return false;
	return window.matchMedia(query).matches;
}

export function EntityDetailPanel() {
	const { open, closePanel, entityType, entityId } = useUIStore();
	const reduced = useReducedMotion();
	const wide = useMediaQuery("(min-width: 1024px)");
	const initialFocusRef = useRef<HTMLButtonElement>(null);
	const panelRef = useFocusTrap<HTMLDivElement>(open);
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const headingId = useId();
	const [playlistOffset, setPlaylistOffset] = useState(0);

	useEffect(() => {
		if (open) {
			previousFocusRef.current = document.activeElement as HTMLElement;
			initialFocusRef.current?.focus();
		} else if (previousFocusRef.current) {
			previousFocusRef.current.focus();
			previousFocusRef.current = null;
		}
	}, [open]);

	// Handle Escape key
	useEffect(() => {
		if (!open) return;
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closePanel();
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [open, closePanel]);

	// Reset pagination when entity changes
	useEffect(() => {
		setPlaylistOffset(0);
	}, []);

	if (!open) return null;

	const isDrawer = wide;
	const panelVariants = isDrawer
		? {
				hidden: { x: 32, opacity: 0 },
				show: { x: 0, opacity: 1 },
			}
		: {
				hidden: { y: 16, opacity: 0 },
				show: { y: 0, opacity: 1 },
			};

	return (
		<div aria-hidden={!open}>
			{/* Backdrop */}
			<Motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: reduced ? 0 : 0.2 }}
				className="fixed inset-0 z-40 bg-black/40"
				onClick={closePanel}
			/>
			{/* Panel */}
			<Motion.div
				ref={panelRef}
				initial="hidden"
				animate="show"
				exit="hidden"
				variants={panelVariants}
				transition={{ type: "spring", stiffness: 260, damping: 25 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby={headingId}
				className={
					isDrawer
						? "fixed right-0 top-0 z-50 h-full w-[min(520px,100vw)] overflow-y-auto bg-white p-6 shadow-xl"
						: "fixed left-1/2 top-16 z-50 w-[min(720px,90vw)] -translate-x-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
				}
			>
				<div className="flex items-start justify-between">
					<h2 id={headingId} className="text-xl font-semibold text-gray-900">
						Details
					</h2>
					<button
						ref={initialFocusRef}
						type="button"
						onClick={closePanel}
						className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					>
						Close
					</button>
				</div>
				<div className="mt-4 text-sm text-gray-700">
					{entityType === "track" && entityId && <TrackDetail id={entityId} />}
					{entityType === "artist" && entityId && (
						<ArtistDetail id={entityId} />
					)}
					{entityType === "album" && entityId && <AlbumDetail id={entityId} />}
					{entityType === "playlist" && entityId && (
						<PlaylistDetail
							id={entityId}
							offset={playlistOffset}
							onLoadMore={() => setPlaylistOffset((o) => o + 10)}
						/>
					)}
				</div>
			</Motion.div>
		</div>
	);
}

function TrackDetail({ id }: { id: string }) {
	const { data, isLoading, error } = useQuery(trackDetailQueryOptions(id));

	useEffect(() => {
		if (data) {
			performance.mark(`detail-ready-${id}`);
			try {
				performance.measure(
					`detail-latency-${id}`,
					`detail-open-${id}`,
					`detail-ready-${id}`,
				);
			} catch {
				// Ignore if start mark doesn't exist
			}
		}
	}, [data, id]);

	if (isLoading) return <div>Loading track…</div>;
	if (error) return <div className="text-red-600">{String(error)}</div>;
	if (!data) return null;
	return (
		<div>
			<div className="mb-3 flex items-center gap-3">
				{data.album?.images?.[0]?.url && (
					<Motion.img
						src={data.album.images[0].url}
						alt={data.name}
						layoutId={`track-${id}`}
						className="aspect-square h-16 w-16 rounded-md object-cover"
					/>
				)}
				<h3 className="text-lg font-semibold">{data.name}</h3>
			</div>
			<p>Artist: {data.artists?.map((a) => a.name).join(", ")}</p>
			<p>Album: {data.album?.name}</p>
		</div>
	);
}

function ArtistDetail({ id }: { id: string }) {
	const { data, isLoading, error } = useQuery(artistDetailQueryOptions(id));

	useEffect(() => {
		if (data) {
			performance.mark(`detail-ready-${id}`);
			try {
				performance.measure(
					`detail-latency-${id}`,
					`detail-open-${id}`,
					`detail-ready-${id}`,
				);
			} catch {
				// Ignore if start mark doesn't exist
			}
		}
	}, [data, id]);

	if (isLoading) return <div>Loading artist…</div>;
	if (error) return <div className="text-red-600">{String(error)}</div>;
	if (!data) return null;
	return (
		<div>
			<div className="mb-3 flex items-center gap-3">
				{data.images?.[0]?.url && (
					<Motion.img
						src={data.images[0].url}
						alt={data.name}
						layoutId={`artist-${id}`}
						className="aspect-square h-16 w-16 rounded-full object-cover"
					/>
				)}
				<h3 className="text-lg font-semibold">{data.name}</h3>
			</div>
			<p>Followers: {data.followers?.total?.toLocaleString?.()}</p>
			<p>Genres: {(data.genres || []).slice(0, 5).join(", ")}</p>
		</div>
	);
}

function AlbumDetail({ id }: { id: string }) {
	const { data, isLoading, error } = useQuery(albumDetailQueryOptions(id));

	useEffect(() => {
		if (data) {
			performance.mark(`detail-ready-${id}`);
			try {
				performance.measure(
					`detail-latency-${id}`,
					`detail-open-${id}`,
					`detail-ready-${id}`,
				);
			} catch {
				// Ignore if start mark doesn't exist
			}
		}
	}, [data, id]);

	if (isLoading) return <div>Loading album…</div>;
	if (error) return <div className="text-red-600">{String(error)}</div>;
	if (!data) return null;
	return (
		<div>
			<div className="mb-3 flex items-center gap-3">
				{data.images?.[0]?.url && (
					<Motion.img
						src={data.images[0].url}
						alt={data.name}
						layoutId={`album-${id}`}
						className="aspect-square h-16 w-16 rounded-md object-cover"
					/>
				)}
				<h3 className="text-lg font-semibold">{data.name}</h3>
			</div>
			<p>By: {data.artists?.map((a) => a.name).join(", ")}</p>
			{/* Track count omitted to match type definitions */}
		</div>
	);
}

function PlaylistDetail({
	id,
	offset,
	onLoadMore,
}: {
	id: string;
	offset: number;
	onLoadMore: () => void;
}) {
	const detail = useQuery(playlistDetailQueryOptions(id));
	const tracks = useQuery(playlistTracksQueryOptions(id, 10, offset));
	const [allTracks, setAllTracks] = useState<
		Array<{ track: import("@/types/spotify").SpotifyTrack }>
	>([]);
	const listRef = useRef<HTMLDivElement>(null);

	const loading = detail.isLoading || tracks.isLoading;

	useEffect(() => {
		if (detail.data) {
			performance.mark(`detail-ready-${id}`);
			try {
				performance.measure(
					`detail-latency-${id}`,
					`detail-open-${id}`,
					`detail-ready-${id}`,
				);
			} catch {
				// Ignore if start mark doesn't exist
			}
		}
	}, [detail.data, id]);

	useEffect(() => {
		if (tracks.data?.items) {
			setAllTracks((prev) => {
				const existing = new Set(prev.map((t) => t.track.id));
				const newItems = tracks.data.items.filter(
					(t) => !existing.has(t.track.id),
				);
				return [...prev, ...newItems];
			});
		}
	}, [tracks.data]);

	// Reset accumulated tracks when playlist changes
	useEffect(() => {
		setAllTracks([]);
	}, []);

	useEffect(() => {
		if (offset > 0 && listRef.current) {
			const lastItem = listRef.current.lastElementChild;
			lastItem?.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	}, [offset]);

	if (loading && allTracks.length === 0) return <div>Loading playlist…</div>;
	if (detail.error)
		return <div className="text-red-600">{String(detail.error)}</div>;
	if (!detail.data) return null;

	const hasMore = allTracks.length < (detail.data.tracks?.total || 0);

	return (
		<div>
			<div className="mb-3 flex items-center gap-3">
				{detail.data.images?.[0]?.url && (
					<Motion.img
						src={detail.data.images[0].url}
						alt={detail.data.name}
						layoutId={`playlist-${id}`}
						className="aspect-square h-16 w-16 rounded-md object-cover"
					/>
				)}
				<h3 className="text-lg font-semibold">{detail.data.name}</h3>
			</div>
			<p>Tracks: {detail.data.tracks?.total}</p>
			<div ref={listRef} className="mt-3 space-y-2">
				{allTracks.map((it, idx) => (
					<button
						key={`${it.track.id}-${idx}`}
						type="button"
						className="flex w-full items-center gap-3 rounded px-2 py-1 text-left hover:bg-gray-100"
						onClick={() =>
							window.open(it.track.external_urls.spotify, "_blank")
						}
					>
						<span className="text-gray-500">{idx + 1}.</span>
						<span className="flex-1 truncate">{it.track.name}</span>
						<span className="truncate text-sm text-gray-500">
							{it.track.artists?.map((a) => a.name).join(", ")}
						</span>
					</button>
				))}
			</div>
			{hasMore && (
				<button
					type="button"
					className="mt-4 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50"
					onClick={onLoadMore}
					disabled={tracks.isLoading}
				>
					{tracks.isLoading ? "Loading..." : "Load more"}
				</button>
			)}
		</div>
	);
}
