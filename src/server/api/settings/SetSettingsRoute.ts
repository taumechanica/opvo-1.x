import { Inject, Injectable } from 'injection-js';
import { number, string } from 'joi';

import { HttpMethod, ReplyFn, Request, Route } from '../Interface';
import { SettingsGateway } from '../../data/SettingsGateway';
import { Settings } from '../../domain/Settings';

@Injectable()
export class SetSettingsRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(@Inject(SettingsGateway) private gateway: SettingsGateway) {
        this.method = 'PUT';
        this.path = '/rest/settings';
    }

    public config = {
        validate: {
            payload: {
                Language: string().required().min(2).max(5),
                YearFrom: number().required().min(2010).max(2030),
                YearTo: number().required().min(2010).max(2030)
            }
        }
    };

    public async handler(request: Request, reply: ReplyFn) {
        const settings = request.payload as Settings;
        await this.gateway.set(settings);

        return reply('').code(204);
    }
}
