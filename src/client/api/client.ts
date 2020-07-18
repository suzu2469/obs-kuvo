export interface IAPIClient {
    get<R>(url: string): Promise<R>
    post<R, P>(url: string, params: P): Promise<R>
}
