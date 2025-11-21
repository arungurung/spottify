import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export type PostType = {
	id: string;
	title: string;
	body: string;
};

export const fetchPosts = createServerFn({ method: "GET" }).handler(
	async () => {
		console.info("Fetching posts from server...");

		return fetch("https://jsonplaceholder.typicode.com/posts")
			.then((response) => response.json())
			.then((data: PostType[]) => data.slice(0, 10));
	},
);

export const fetchPost = createServerFn({ method: "GET" })
	.inputValidator((postId: string) => postId)
	.handler(async ({ data: postId }) => {
		console.info("Fetching post from server...", postId);

		const post = fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
			.then((response) => response.json())
			.then((data: PostType) => data)
			.catch((error) => {
				console.error("Error fetching post:", error);
				if (error.status === 404) {
					throw notFound();
				}
				throw error;
			});

		return post;
	});
