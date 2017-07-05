import { Injector } from 'injection-js';

import { RouteFactory } from '../../abstract/RouteFactory';

import { GetDeveloperByIdRoute } from './Route';
import { GetDeveloperByIdSchema } from './Schema';

export class GetDeveloperByIdRouteFactory
implements RouteFactory<GetDeveloperByIdRoute> {
    public constructor(private injector: Injector) { }

    public createRoute() {
        return new GetDeveloperByIdRoute(this.injector);
    }

    public createSchema() {
        return new GetDeveloperByIdSchema();
    }
}
