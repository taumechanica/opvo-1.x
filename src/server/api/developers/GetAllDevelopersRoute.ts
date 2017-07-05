import { Inject, Injectable } from 'injection-js';

import { HttpMethod, ReplyFn, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/developers/Gateway';

@Injectable()
export class GetAllDevelopersRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(@Inject(DevelopersGateway) private gateway: DevelopersGateway) {
        this.method = 'GET';
        this.path = '/rest/developers';
    }

    public async handler(request: Request, reply: ReplyFn) {
        const developers = await this.gateway.getAll();

        return reply(developers);
    }
}
