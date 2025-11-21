import {
	createFileRoute,
	ErrorComponent,
	type ErrorComponentProps,
} from "@tanstack/react-router";
import NotFound from "@/components/NotFound";
import { fetchPost } from "@/utils/posts";

const PostErrorComponent = ({ error }: ErrorComponentProps) => (
	<ErrorComponent error={error} />
);

export const Route = createFileRoute("/_authed/posts/$postId")({
	component: RouteComponent,
	errorComponent: PostErrorComponent,
	notFoundComponent: () => {
		return <NotFound>Post not found</NotFound>;
	},
	loader: ({ params: { postId } }) => fetchPost({ data: postId }),
});

function RouteComponent() {
	const post = Route.useLoaderData();

	return (
		<div className="space-y-2">
			<h4 className="text-xl font-bold underline">{post.title}</h4>
			<div className="text-sm">{post.body}</div>
		</div>
	);
}
