export type ApiMethod = 'GET';

export interface ApiReply {
    (result?: any): ApiResponse;
}

export interface ApiSchema {
    params: Object;
    payload: Object;
}

export interface ApiRequest {
    params: Object;
    payload: Object;
}

export interface ApiResponse { }

export interface ApiRoute {
    method: ApiMethod;
}
