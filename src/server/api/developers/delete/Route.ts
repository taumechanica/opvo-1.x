import { Injector } from 'injection-js';

import { HttpMethod, ReplyFn, Request, Route } from '../../abstract/Interface';
import { DevelopersGateway } from '../../../data/developers/Gateway';
import { Developer } from '../../../domain/Developer';

export class DeleteDeveloperRoute implements Route {
    public method: HttpMethod;
    public path: string;

    private gateway: DevelopersGateway;

    public constructor(private injector: Injector) {
        this.method = 'DELETE';
        this.path = '/rest/developers/{DeveloperId}';

        this.gateway = injector.get(DevelopersGateway);
    }

    public async handler(request: Request, reply: ReplyFn) {
        const id = parseInt(request.params.DeveloperId);
        const changes = await this.gateway.delete(id);

        return reply('').code(!changes || changes.Count ? 204 : 404);
    }
}
