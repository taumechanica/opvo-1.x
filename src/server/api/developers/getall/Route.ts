import { Database } from 'sqlite';

import { ApiMethod, ApiReply, ApiRequest, ApiRoute } from '../../abstract/Interface';
import { DevelopersGateway } from '../../../data/DevelopersGateway';

export class GetAllDevelopersRoute implements ApiRoute {
    public method: ApiMethod;
    public path: string;

    private gateway: DevelopersGateway;

    public constructor(private db: Database) {
        this.method = 'GET';
        this.path = '/rest/developers';

        this.gateway = new DevelopersGateway(db);
    }

    public async handler(request: ApiRequest, reply: ApiReply) {
        const developers = await this.gateway.getAll();

        return reply(developers);
    }
}
