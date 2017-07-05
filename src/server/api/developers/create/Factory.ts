import { Injector } from 'injection-js';

import { RouteFactory } from '../../abstract/RouteFactory';

import { CreateDeveloperRoute } from './Route';
import { CreateDeveloperSchema } from './Schema';

export class CreateDeveloperRouteFactory
implements RouteFactory<CreateDeveloperRoute> {
    public constructor(private injector: Injector) { }

    public createRoute() {
        return new CreateDeveloperRoute(this.injector);
    }

    public createSchema() {
        return new CreateDeveloperSchema();
    }
}
