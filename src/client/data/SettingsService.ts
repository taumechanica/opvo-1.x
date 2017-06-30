import { IHttpService } from 'angular';

import { Settings } from '../domain/Settings';

export class SettingsService {
    public constructor(private $http: IHttpService) {
        'ngInject';
    }

    public async get() {
        const url = '/rest/settings';
        const response = await this.$http.get<Settings>(url);

        return response.data;
    }

    public async set(settings: Settings) {
        const url = '/rest/settings';
        await this.$http.put<void>(url, settings);
    }
}
