import { Developer } from '../domain/Developer';

export class DevelopersService {
	constructor(private $http: ng.IHttpService) {
		'ngInject';
	}

	public getAll(): ng.IHttpPromise<Developer[]> {
		return this.$http.get<Developer[]>('/rest/developers');
	}
}
