import { Injector } from 'injection-js';

import { RouteFactory } from '../../abstract/RouteFactory';

import { DeleteDeveloperRoute } from './Route';
import { DeleteDeveloperSchema } from './Schema';

export class DeleteDeveloperRouteFactory
implements RouteFactory<DeleteDeveloperRoute> {
    public constructor(private injector: Injector) { }

    public createRoute() {
        return new DeleteDeveloperRoute(this.injector);
    }

    public createSchema() {
        return new DeleteDeveloperSchema();
    }
}
