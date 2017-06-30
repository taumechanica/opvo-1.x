import { ApiSchema } from './Interface';

export interface RouteFactory {
    createSchema(): ApiSchema;
}
