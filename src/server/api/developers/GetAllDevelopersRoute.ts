import { Inject, Injectable } from 'injection-js';

import { HttpMethod, ResponseTk, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/DevelopersGateway';

@Injectable()
export class GetAllDevelopersRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(@Inject(DevelopersGateway) private gateway: DevelopersGateway) {
        this.method = 'GET';
        this.path = '/rest/developers';
    }

    public async handler(request: Request, tk: ResponseTk) {
        const developers = await this.gateway.getAll();

        return tk.response(developers);
    }
}
