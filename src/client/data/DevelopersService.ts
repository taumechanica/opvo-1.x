import { Developer } from '../domain/Developer';

export class DevelopersService {
	constructor(private $http: ng.IHttpService) {
		'ngInject';
	}

	public getAll() {
		return this.$http.get<Developer[]>('/rest/developers');
	}

	public create(developer: Developer) {
		return this.$http.post<string>('/rest/developersq', developer);
	}
}
