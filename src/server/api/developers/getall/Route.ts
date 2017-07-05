import { Injector } from 'injection-js';

import { HttpMethod, ReplyFn, Request, Route } from '../../abstract/Interface';
import { DevelopersGateway } from '../../../data/developers/Gateway';

export class GetAllDevelopersRoute implements Route {
    public method: HttpMethod;
    public path: string;

    private gateway: DevelopersGateway;

    public constructor(private injector: Injector) {
        this.method = 'GET';
        this.path = '/rest/developers';

        this.gateway = injector.get(DevelopersGateway);
    }

    public async handler(request: Request, reply: ReplyFn) {
        const developers = await this.gateway.getAll();

        return reply(developers);
    }
}
