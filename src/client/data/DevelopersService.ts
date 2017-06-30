import { IHttpService } from 'angular';

import { Developer } from '../domain/Developer';

export class DevelopersService {
    public constructor(private $http: IHttpService) {
        'ngInject';
    }

    public async getAll() {
        const url = '/rest/developers';
        const response = await this.$http.get<Developer[]>(url);

        return response.data;
    }

    public async getById(id: number) {
        const url = `/rest/developers/${id}`;
        const response = await this.$http.get<Developer>(url);

        return response.data;
    }

    public async create(developer: Developer) {
        const url = '/rest/developers';
        const response = await this.$http.post<string>(url, developer);

        return response.data;
    }

    public async update(developer: Developer) {
        const url = `/rest/developers/${developer.Id}`;
        await this.$http.put<void>(url, developer);
    }

    public async delete(developer: Developer) {
        const url = `/rest/developers/${developer.Id}`;
        await this.$http.delete<void>(url);
    }
}
