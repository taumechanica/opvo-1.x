import { Database } from '../../../data/abstract/Database';
import { Schema } from '../../abstract/Interface';
import { RouteFactory } from '../../abstract/RouteFactory';

import { GetAllDevelopersRoute } from './Route';

export class GetAllDevelopersRouteFactory
implements RouteFactory<GetAllDevelopersRoute> {
    public constructor(private db: Database) { }

    public createRoute() {
        return new GetAllDevelopersRoute(this.db);
    }

    public createSchema(): Schema {
        return null;
    }
}
