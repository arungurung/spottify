import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="min-h-screen">
			<div className="container mx-auto py-20 text-center">
				<h1 className="text-4xl font-bold mb-8">Welcome to the Chat App API</h1>
			</div>
		</div>
	);
}
