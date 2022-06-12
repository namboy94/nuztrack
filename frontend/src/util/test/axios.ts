import {AxiosResponse} from "axios";
import {Observable, of} from "rxjs";

export function buildResponse<T>(data: T): Observable<AxiosResponse<T>> {
    const response: AxiosResponse = {
        config: {},
        data: data,
        headers: {},
        status: 200,
        statusText: "OK"
    }
    return of(response)
}
