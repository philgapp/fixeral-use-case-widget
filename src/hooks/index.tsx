import { useCallback, useEffect, useRef, useState } from "react";

interface State<T> {
    data: T | null;
    loading: boolean;
    error?: string;
}

type LazyFetchResponse<T> = [(...params: any) => Promise<void>, State<T>];

export class ValidationError extends Error {}

export function useLazyFetch<T>(
    func: (...params: any) => Promise<any>,
    initialState?: Partial<Pick<State<T>, "loading">>
) {
    const defaultState: State<T> = {
        data: null,
        loading: false,
        ...initialState,
    };

    const [state, setState] = useState(defaultState);

    const isSubscribed = useRef(true);

    const callback = useCallback(
        async (...params) => {
            try {
                setState({
                    ...state,
                    loading: true,
                });

                const response = await func(...params);

                if (isSubscribed.current) {
                    setState({
                        data: response,
                        error: undefined,
                        loading: false,
                    });
                }
            } catch (error) {
                if (isSubscribed.current) {
                    setState({
                        ...state,
                        error: `${error.message}`,
                        loading: false,
                    });
                }
            }
        },
        [func]
    );

    useEffect(() => {
        return () => {
            isSubscribed.current = false;
        };
    }, []);

    return [callback, state] as LazyFetchResponse<T>;
}
