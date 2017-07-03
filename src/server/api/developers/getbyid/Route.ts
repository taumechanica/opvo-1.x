import { Database } from '../../../data/abstract/Database';
import { HttpMethod, ReplyFn, Request, Route } from '../../abstract/Interface';

import { DevelopersGateway } from '../../../data/developers/Gateway';

export class GetDeveloperByIdRoute implements Route {
    public method: HttpMethod;
    public path: string;

    private gateway: DevelopersGateway;

    public constructor(private db: Database) {
        this.method = 'GET';
        this.path = '/rest/developers/{DeveloperId}';

        this.gateway = new DevelopersGateway(db);
    }

    public async handler(request: Request, reply: ReplyFn) {
        const id = parseInt(request.params.DeveloperId);
        const developer = await this.gateway.getById(id);

        return reply(developer).code(developer ? 200 : 404);
    }
}
