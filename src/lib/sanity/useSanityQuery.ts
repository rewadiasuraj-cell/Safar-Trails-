import { useEffect, useState } from 'react';
import { sanityClient } from './client';

interface SanityQueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Fetches a GROQ query from Sanity and tracks loading/error state for a component. */
export function useSanityQuery<T>(query: string, params?: Record<string, unknown>): SanityQueryState<T> {
  const paramsKey = params ? JSON.stringify(params) : '';
  const [state, setState] = useState<SanityQueryState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    sanityClient
      .fetch<T>(query, params || {})
      .then((result) => {
        if (!cancelled) setState({ data: result, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load content from Sanity.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // paramsKey is a stable stand-in for the params object's identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paramsKey]);

  return state;
}
