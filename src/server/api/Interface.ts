export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ResponseTk {
    response(result?: string | object): Response;
}

export interface Schema {
    params?: any;
    payload?: any;
}

export interface Request {
    params: {
        [name: string]: string;
    };
    payload: any;
}

export interface Response {
    code(statusCode: number): Response;
}

export interface Route {
    method: HttpMethod;
    path: string;

    handler: (request: Request, tk: ResponseTk) => Response | Promise<Response>;

    config?: {
        validate: Schema;
    };
}
