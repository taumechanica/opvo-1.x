import { Injector } from 'injection-js';

import { HttpMethod, ReplyFn, Request, Route } from '../../abstract/Interface';
import { DevelopersGateway } from '../../../data/developers/Gateway';
import { Developer } from '../../../domain/Developer';

export class CreateDeveloperRoute implements Route {
    public method: HttpMethod;
    public path: string;

    private gateway: DevelopersGateway;

    public constructor(private injector: Injector) {
        this.method = 'POST';
        this.path = '/rest/developers';

        this.gateway = injector.get(DevelopersGateway);
    }

    public async handler(request: Request, reply: ReplyFn) {
        const record = await this.gateway.create(request.payload as Developer);

        return reply(`/rest/developers/${record.Id}`).code(201);
    }
}
