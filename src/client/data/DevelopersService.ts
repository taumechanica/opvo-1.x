import { Developer } from '../domain/Developer';

export class DevelopersService {
	constructor(private $http: ng.IHttpService) {
		'ngInject';
	}

	public getAll() {
		return this.$http.get<Developer[]>('/rest/developers');
	}

	public create(developer: Developer) {
		return this.$http.post<string>('/rest/developers', developer);
	}

	public update(developer: Developer) {
		return this.$http.put<string>(`/rest/developers/${developer.Id}`, developer);
	}

	public delete(developer: Developer) {
		return this.$http.delete<string>(`/rest/developers/${developer.Id}`);
	}
}
