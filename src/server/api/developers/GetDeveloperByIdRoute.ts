import { Inject, Injectable } from 'injection-js';
import { number } from 'joi';

import { HttpMethod, ResponseTk, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/DevelopersGateway';

@Injectable()
export class GetDeveloperByIdRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(@Inject(DevelopersGateway) private gateway: DevelopersGateway) {
        this.method = 'GET';
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

        return tk.response(developer).code(developer ? 200 : 404);
    }
}
