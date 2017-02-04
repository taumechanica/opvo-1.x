import { Contract } from '../domain/Contract';
import { Developer } from '../domain/Developer';

export class ContractsService {
	constructor(private $http: ng.IHttpService) {
		'ngInject';
	}

	public getAllByYear(developer: Developer, year: number) {
		return this.$http.get<Contract[]>(`/rest/developers/${developer.Id}/contracts-${year}`);
	}
}
