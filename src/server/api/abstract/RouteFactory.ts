import { Route, Schema } from './Interface';

export interface RouteFactory<T extends Route> {
    createRoute(): T;
    createSchema(): Schema;
}
