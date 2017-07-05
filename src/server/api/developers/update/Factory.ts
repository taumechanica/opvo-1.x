import { Injector } from 'injection-js';

import { SqlDatabase } from '../../../data/abstract/SqlDatabase';
import { RouteFactory } from '../../abstract/RouteFactory';

import { UpdateDeveloperRoute } from './Route';
import { UpdateDeveloperSchema } from './Schema';

export class UpdateDeveloperRouteFactory
implements RouteFactory<UpdateDeveloperRoute> {
    public constructor(private injector: Injector) { }

    public createRoute() {
        return new UpdateDeveloperRoute(this.injector);
    }

    public createSchema() {
        return new UpdateDeveloperSchema();
    }
}
