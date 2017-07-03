import { Database } from '../../../data/abstract/Database';
import { RouteFactory } from '../../abstract/RouteFactory';

import { GetDeveloperByIdRoute } from './Route';
import { GetDeveloperByIdSchema } from './Schema';

export class GetDeveloperByIdRouteFactory
implements RouteFactory<GetDeveloperByIdRoute> {
    public constructor(private db: Database) { }

    public createRoute() {
        return new GetDeveloperByIdRoute(this.db);
    }

    public createSchema() {
        return new GetDeveloperByIdSchema();
    }
}
