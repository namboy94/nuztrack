import {Observable} from "rxjs";
import {DependencyList, useEffect, useState} from "react";

export function useService<T>(serviceFunction: () => Observable<T>, deps: DependencyList = []): boolean {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const subscription = serviceFunction().subscribe({
            complete: () => setLoading(false)
        })
        return () => subscription.unsubscribe()
    }, deps)
    return loading
}


export function useQuery<T>(queryFunction: () => Observable<T>, initial: T, deps: DependencyList = []): T {
    const [queryResult, setQueryResult] = useState<T>(initial)
    useEffect(() => {
        const subscription = queryFunction().subscribe({
            next: result => {
                setQueryResult(result)
            }
        })
        return () => subscription.unsubscribe()
    }, deps)
    return queryResult
}

export function useSubmitter(observerFN: () => Observable<any>, onSuccess: () => void, onError: (e: any) => void): () => void {
    const [submitting, setSubmitting] = useState(false)

    return () => {
        if (submitting) {
            return
        }
        setSubmitting(true)
        observerFN().subscribe({
            error: e => {
                onError(e)
                setSubmitting(false)
            },
            complete: () => {
                onSuccess()
                setTimeout(() => setSubmitting(false), 1000)
            }
        })
    }
}