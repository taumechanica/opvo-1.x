import { Injector } from 'injection-js';

import { Schema } from '../../abstract/Interface';
import { RouteFactory } from '../../abstract/RouteFactory';

import { GetAllDevelopersRoute } from './Route';

export class GetAllDevelopersRouteFactory
implements RouteFactory<GetAllDevelopersRoute> {
    public constructor(private injector: Injector) { }

    public createRoute() {
        return new GetAllDevelopersRoute(this.injector);
    }

    public createSchema(): Schema {
        return null;
    }
}
