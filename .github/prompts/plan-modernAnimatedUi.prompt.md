Architecture

- Add `MotionProvider` wrapping root (Framer Motion `LazyMotion`, reduced motion detection).
- Introduce centralized `EntityDetailPanel` (modal on mobile, side drawer on wide screens ≥1024px) with shared-element transitions from cards (`layoutId`).
- Add lightweight `uiStore` (context) for active entity state and panel visibility.
- Gate animation-heavy code to client after hydration to avoid SSR mismatches.

Components To Add / Refactor

- `MotionProvider`, `uiStore` context.
- Refactor `TrackCard`, `ArtistCard`, `PlaylistCard`, `AlbumCard`: add `layoutId`, focus handling, hover prefetch, tilt/elevation animation.
- `EntityDetailPanel`: unified detail view (image, title, metadata, actions) using minimal first-release data, with progressive sections (e.g. related artists, audio features) loaded on demand.
- `DashboardTabs`: animated tab list with sliding indicator (`layoutId="tab-indicator"`).
- `AnimatedMenu`: contextual actions (e.g. open in Spotify, copy link).
- `LoadingGrid`, `PrefetchBoundary`, `FocusScope` utilities.
- Optional `ViewportList` using TanStack Virtualizer for large lists.

Animation Techniques

- Shared element transitions (card → detail header) via `layoutId`.
- Staggered entrance of cards with intersection observer; fallback to static if reduced motion.
- Subtle hover tilt (pointer position → `rotateX/rotateY`) or scale-only fallback.
- Card stack layering for playlist track previews (slight transforms).
- Animated tabs with spring indicator and opacity fade for inactive content; default to minimal data views (10 items per section) with "Load more" affordance.
- Drawer/modal transitions: backdrop fade, panel spring (Y for modal, X for drawer).
- Skeleton shimmer (CSS only if reduced motion).

Data Fetching Strategy

- Maintain existing list queries; add detail query sets per entity. For the first release, cap initial lists to `limit: 10` for smoother UI:
  - Artist: `/v1/artists/{id}`, `/v1/artists/{id}/top-tracks`, `/v1/artists/{id}/albums`, optional `/related-artists`.
  - Track: `/v1/tracks/{id}`, `/v1/audio-features/{id}`, optional `/v1/audio-analysis/{id}`.
  - Playlist: `/v1/playlists/{id}`, `/v1/playlists/{id}/tracks` (paginated).
  - Album: `/v1/albums/{id}`, `/v1/albums/{id}/tracks`.
- Server functions to add in `spotify-api.ts`: `getArtistFn`, `getArtistTopTracksFn`, `getArtistAlbumsFn`, `getRelatedArtistsFn`, `getTrackFn`, `getTrackAudioFeaturesFn` (audio analysis deferred), `getPlaylistFn`, `getPlaylistItemsFn`, `getAlbumFn`, `getAlbumTracksFn`.
- Prefetch on hover/focus with short debounce; show panel immediately with skeleton while queries resolve; secondary (non-critical) queries load after mount (idle callback).

Accessibility & Performance

- Respect `prefers-reduced-motion`: disable tilt, shared-element transforms, use minimal opacity transitions.
- Cards: keyboard focusable (`tabIndex=0`), Enter/Space opens detail (`aria-haspopup="dialog"`).
- Detail panel: `role="dialog"`, `aria-modal="true"`, labelled by entity name; trap focus; Escape to close; restore prior focus.
- Tabs: proper `role="tablist"`, `role="tab"`, `aria-selected`; panels `role="tabpanel"`.
- Menu: `role="menu"` / `menuitem` with arrow-key navigation.
- Virtualize only when item count exceeds section thresholds; avoid animating non-transform properties (no animated box-shadow).
  Virtualization thresholds:
  - Recently Played: enable when items > 60.
  - Playlists/Albums (heavier cards): enable when items > 50.
  - Artists/Tracks (lighter cards): enable when items > 75.
    Additionally, if measured visible DOM exceeds ~1500 nodes or render time per frame > 16ms, turn on virtualization.
- Prefetch abort if hover leaves quickly; compress network bursts with `Promise.all`.
- Performance marks for detail open → data ready latency.

Incremental Rollout

1. Add `MotionProvider`, reduced motion hook, and `uiStore`.
2. Implement static `EntityDetailPanel` (no animation).
3. Add artist detail server functions + panel fetch + skeletons.
4. Introduce shared-element transitions for artist cards.
5. Extend to track/playlist/album detail flows (limit responses to 10 items for first release).
6. Add animated tabs for dashboard sections.
7. Integrate hover prefetch + debounce + abort handling.
8. Enhance menu actions & secondary data (related artists, audio features).
9. Implement drawer variant for wide screens.
10. Add hover tilt & entrance staggering (guarded by reduced motion).
11. Accessibility audit & keyboard flow refinement.
12. Performance tuning (virtualization, marks) and polish.

Key Decisions To Confirm

- Detail surface format: modal vs side drawer vs pinned section on wide screens.
- Scope of initial detail data (minimal vs full set) for first release.
- Whether to include audio analysis (heavier) initially or defer.
- Threshold for enabling virtualization.
