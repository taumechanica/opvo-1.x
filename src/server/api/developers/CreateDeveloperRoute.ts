import { Inject, Injectable } from 'injection-js';
import { number, string } from 'joi';

import { HttpMethod, ReplyFn, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/developers/Gateway';
import { Developer } from '../../domain/Developer';

@Injectable()
export class CreateDeveloperRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(@Inject(DevelopersGateway) private gateway: DevelopersGateway) {
        this.method = 'POST';
        this.path = '/rest/developers';
    }

    public config = {
        validate: {
            payload: {
                Name: string().required().min(4).max(128),
                CeilingAmount: number().required().min(0)
            }
        }
    };

    public async handler(request: Request, reply: ReplyFn) {
        const record = await this.gateway.create(request.payload as Developer);

        return reply(`/rest/developers/${record.Id}`).code(201);
    }
}
