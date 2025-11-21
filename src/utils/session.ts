import { useSession } from "@tanstack/react-start/server";

type SessionUser = {
	userEmail: string;
};

export function useAppSession() {
	return useSession<SessionUser>({
		password: "my_secret_session_password_something_secure_to_change",
	});
}
