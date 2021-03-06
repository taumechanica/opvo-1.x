import { Inject, Injectable } from 'injection-js';
import { number } from 'joi';

import { HttpMethod, ResponseTk, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/DevelopersGateway';
import { Developer } from '../../domain/Developer';

@Injectable()
export class DeleteDeveloperRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(@Inject(DevelopersGateway) private gateway: DevelopersGateway) {
        this.method = 'DELETE';
        this.path = '/rest/developers/{DeveloperId}';
    }

    public config = {
        validate: {
            params: {
                DeveloperId: number().required().integer().min(1)
            }
        }
    };

    public async handler(request: Request, tk: ResponseTk) {
        const id = parseInt(request.params.DeveloperId);
        const developer = await this.gateway.getById(id);
        if (!developer) return tk.response('').code(404);

        await this.gateway.delete(developer);

        return tk.response('').code(204);
    }
}
