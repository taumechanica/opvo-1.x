import { Inject, Injectable } from 'injection-js';
import { number, string } from 'joi';

import { HttpMethod, ReplyFn, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/DevelopersGateway';
import { Developer } from '../../domain/Developer';

@Injectable()
export class UpdateDeveloperRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(@Inject(DevelopersGateway) private gateway: DevelopersGateway) {
        this.method = 'PUT';
        this.path = '/rest/developers/{DeveloperId}';
    }

    public config = {
        validate: {
            params: {
                DeveloperId: number().required().integer().min(1)
            },
            payload: {
                Id: number().required().integer().min(1),
                Name: string().required().min(4).max(128),
                CeilingAmount: number().required().min(0)
            }
        }
    };

    public async handler(request: Request, reply: ReplyFn) {
        const id = parseInt(request.params.DeveloperId);
        const developer = request.payload as Developer;
        if (id != developer.Id) return reply('').code(400);

        const changes = await this.gateway.update(developer);

        return reply('').code(!changes || changes.Count ? 204 : 404);
    }
}
