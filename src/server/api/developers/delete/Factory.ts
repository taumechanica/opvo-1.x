import { Database } from '../../../data/abstract/Database';
import { RouteFactory } from '../../abstract/RouteFactory';

import { DeleteDeveloperRoute } from './Route';
import { DeleteDeveloperSchema } from './Schema';

export class DeleteDeveloperRouteFactory
implements RouteFactory<DeleteDeveloperRoute> {
    public constructor(private db: Database) { }

    public createRoute() {
        return new DeleteDeveloperRoute(this.db);
    }

    public createSchema() {
        return new DeleteDeveloperSchema();
    }
}
