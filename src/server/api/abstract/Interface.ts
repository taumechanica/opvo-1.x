export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ReplyFn {
    (result?: any): Response;
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

    handler: (request: Request, reply: ReplyFn) => Response | Promise<Response>;

    config?: {
        validate: Schema;
    };
}
