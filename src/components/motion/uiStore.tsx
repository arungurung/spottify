import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

export type EntityType = "artist" | "track" | "album" | "playlist";

interface UIState {
	open: boolean;
	entityType?: EntityType;
	entityId?: string;
}

interface UIStoreContext extends UIState {
	openPanel: (type: EntityType, id: string) => void;
	closePanel: () => void;
}

const UIStore = createContext<UIStoreContext | null>(null);

export function useUIStore() {
	const ctx = useContext(UIStore);
	if (!ctx) throw new Error("useUIStore must be used within UIStoreProvider");
	return ctx;
}

export function UIStoreProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<UIState>({ open: false });
	const value: UIStoreContext = {
		...state,
		openPanel: (type, id) =>
			setState({ open: true, entityType: type, entityId: id }),
		closePanel: () => setState({ open: false }),
	};
	return <UIStore.Provider value={value}>{children}</UIStore.Provider>;
}
