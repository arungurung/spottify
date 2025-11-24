import { useSession } from "@tanstack/react-start/server";
import { env } from "@/env";

export type SessionUser = {
	spotifyId?: string;
	displayName?: string;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number;
};

export function getAppSession() {
	return useSession<SessionUser>({
		password: env.SESSION_SECRET,
		name: "app-session",
		cookie: {
			secure: process.env.NODE_ENV === "production", // HTTPS only in production
			sameSite: "lax", // CSRF protection
			httpOnly: true, // XSS protection
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		},
	});
}
