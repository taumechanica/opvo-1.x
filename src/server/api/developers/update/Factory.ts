import { Database } from '../../../data/abstract/Database';
import { RouteFactory } from '../../abstract/RouteFactory';

import { UpdateDeveloperRoute } from './Route';
import { UpdateDeveloperSchema } from './Schema';

export class UpdateDeveloperRouteFactory
implements RouteFactory<UpdateDeveloperRoute> {
    public constructor(private db: Database) { }

    public createRoute() {
        return new UpdateDeveloperRoute(this.db);
    }

    public createSchema() {
        return new UpdateDeveloperSchema();
    }
}
