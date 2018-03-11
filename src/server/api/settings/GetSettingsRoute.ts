import { Inject, Injectable } from 'injection-js';

import { HttpMethod, ResponseTk, Request, Route } from '../Interface';
import { SettingsGateway } from '../../data/SettingsGateway';

@Injectable()
export class GetSettingsRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(@Inject(SettingsGateway) private gateway: SettingsGateway) {
        this.method = 'GET';
        this.path = '/rest/settings';
    }

    public async handler(request: Request, tk: ResponseTk) {
        const settings = await this.gateway.get();

        return tk.response(settings);
    }
}
