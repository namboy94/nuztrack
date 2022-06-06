import {UseQueryResult} from "react-query";

export function performLoadingCheck(queries: UseQueryResult[]) {

    let isLoading: boolean = false;
    let hasError: boolean = false;

    queries.forEach(x => isLoading = isLoading || x.isLoading || x.isIdle)
    queries.forEach(x => hasError || x.error || x.data === undefined || x.data === null)

    if (isLoading) {
        return (<h1>Loading</h1>)
    } else if (hasError) {
        return (<h1>Error</h1>)
    } else {
        return null
    }
}