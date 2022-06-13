import {Observable} from "rxjs";
import {DependencyList, useEffect, useState} from "react";

export function useService<T>(serviceObservable: Observable<T>, deps: DependencyList): boolean {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const subscription = serviceObservable.subscribe({
            complete: () => setLoading(false)
        })
        return () => subscription.unsubscribe()
    }, deps)
    return loading
}


export function useQuery<T>(queryObservable: Observable<T>, initial: T, deps: DependencyList): T {
    const [queryResult, setQueryResult] = useState<T>(initial)
    useEffect(() => {
        const subscription = queryObservable.subscribe({
            next: result => {
                setQueryResult(result)
            }
        })
        return () => subscription.unsubscribe()
    }, deps)
    return queryResult
}
