import { useCallback, useState } from "react";

export function useMutation<TVariables, TData, TError = Error>(opts: {
	fn: (variables: TVariables) => Promise<TData>;
	onSuccess?: (ctx: { data: TData }) => Promise<void> | void;
}) {
	const [status, setStatus] = useState<
		"idle" | "pending" | "success" | "error"
	>("idle");
	const [data, setData] = useState<TData | undefined>();
	const [error, setError] = useState<TError | undefined>();
	const [variables, setVariables] = useState<TVariables | undefined>();
	const [submittedAt, setSubmittedAt] = useState<number | undefined>();

	const mutate = useCallback(
		async (variables: TVariables): Promise<TData | undefined> => {
			setStatus("pending");
			setSubmittedAt(Date.now());
			setVariables(variables);

			try {
				const data = await opts.fn(variables);
				await opts.onSuccess?.({ data });
				setData(data);
				setError(undefined);
				setStatus("success");
				return data;
			} catch (err: unknown) {
				setStatus("error");
				setError(err as TError);
			}
		},
		[opts.fn, opts.onSuccess],
	);

	return {
		mutate,
		status,
		data,
		error,
		variables,
		submittedAt,
	};
}
