import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import type {
	albumDetailQueryOptions,
	artistDetailQueryOptions,
	playlistDetailQueryOptions,
	trackDetailQueryOptions,
} from "@/utils/spotify-queries";

type QueryOptions = ReturnType<
	| typeof trackDetailQueryOptions
	| typeof artistDetailQueryOptions
	| typeof albumDetailQueryOptions
	| typeof playlistDetailQueryOptions
>;

interface UsePrefetchOptions {
	debounceMs?: number;
}

/**
 * Hook for debounced prefetching of entity detail queries on hover/focus.
 * Automatically aborts if user leaves quickly.
 */
export function usePrefetch({ debounceMs = 200 }: UsePrefetchOptions = {}) {
	const queryClient = useQueryClient();
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const abortControllerRef = useRef<AbortController>();

	const prefetch = useCallback(
		(queryOptions: QueryOptions) => {
			// Clear any pending prefetch
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Abort any in-flight prefetch
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			timeoutRef.current = setTimeout(() => {
				abortControllerRef.current = new AbortController();
				queryClient.prefetchQuery({
					...queryOptions,
					signal: abortControllerRef.current.signal,
				});
			}, debounceMs);
		},
		[queryClient, debounceMs],
	);

	const cancel = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
	}, []);

	return { prefetch, cancel };
}
