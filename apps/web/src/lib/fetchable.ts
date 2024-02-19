import { useState } from "react";

// Fetchable pattern used for all requests
export type Fetchable<T> = {
    isFetched: boolean;
    isLoading: boolean;
    data: null | T;
    error: null | string;
};
  
// Spawn default state for fetchable when needed
export const FETCHABLE = () => ({
    isFetched: false,
    isLoading: false,
    data: null,
    error: null,
}); 5

// Hook for typing fetchable
export const useFetchable = <T,>() => useState<Fetchable<T>>(FETCHABLE());
  
// Accept a promise to run and auto set fetchable isLoading and error states.
export const handleFetchable = async (
    action: () => Promise<any>,
    setFetchable: (fn: (fetchable: Fetchable<any>) => Fetchable<any>) => void
) => {
    setFetchable((prev: Fetchable<any>) => ({
        ...prev,
        isLoading: true,
    }));
  
    try {
        const data = await action();
    
        setFetchable((prev: Fetchable<any>) => ({
            ...prev,
            data,
        }));
    } catch (error) {
        console.error(error);

        setFetchable((prev: Fetchable<any>) => ({
            ...prev,
            error: String(error),
        }));
    } finally {
      setFetchable((prev: Fetchable<any>) => ({
        ...prev,
        isLoading: false,
        isFetched: true,
      }));
    }
};