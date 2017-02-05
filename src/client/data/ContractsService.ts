import { Contract } from '../domain/Contract';
import { Developer } from '../domain/Developer';

interface ContractJson {
	Id: number;
	DeveloperId: number;
	Amount: number;
	StartDate: number;
	Deadline: number;
	AcceptanceDate?: number;
}

export class ContractsService {
	constructor(private $http: ng.IHttpService) {
		'ngInject';
	}

	public getAllByYear(developer: Developer, year: number) {
		const url = `/rest/developers/${developer.Id}/contracts-${year}`;
		return this.$http.get<ContractJson[]>(url).then(({ data }) => data.map(json => this.decode(json)));
	}

	public create(developer: Developer, contract: Contract) {
		const url = `/rest/developers/${developer.Id}/contracts`;
		return this.$http.post<string>(url, this.encode(contract));
	}

	public update(developer: Developer, contract: Contract) {
		const url = `/rest/developers/${developer.Id}/contracts/${contract.Id}`;
		return this.$http.put<string>(url, this.encode(contract));
	}

	public delete(developer: Developer, contract: Contract) {
		const url = `/rest/developers/${developer.Id}/contracts/${contract.Id}`;
		return this.$http.delete<string>(url);
	}

	private encode(contract: Contract) {
		const { Id, DeveloperId, Amount } = contract;
		const result = <ContractJson>{ Id, DeveloperId, Amount };
		result.StartDate = contract.StartDate.valueOf();
		result.Deadline = contract.Deadline.valueOf();
		if (contract.AcceptanceDate) {
			result.AcceptanceDate = contract.AcceptanceDate.valueOf();
		}
		return result;
	}

	private decode(contractJson: ContractJson) {
		const { Id, DeveloperId, Amount } = contractJson;
		const result = <Contract>{ Id, DeveloperId, Amount };
		result.StartDate = new Date(contractJson.StartDate);
		result.Deadline = new Date(contractJson.Deadline);
		if (contractJson.AcceptanceDate) {
			result.AcceptanceDate = new Date(contractJson.AcceptanceDate);
		}
		return result;
	}
}
