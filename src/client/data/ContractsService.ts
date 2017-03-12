import { IHttpService } from 'angular';

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
	public constructor(private $http: IHttpService) {
		'ngInject';
	}

	public async getAllByYear(developer: Developer, year: number) {
		const url = `/rest/developers/${developer.Id}/contracts-${year}`;
		const response = await this.$http.get<ContractJson[]>(url);

		return response.data.map(json => this.decode(json));
	}

	public async create(developer: Developer, contract: Contract) {
		const url = `/rest/developers/${developer.Id}/contracts`;
		const response = await this.$http.post<string>(url, this.encode(contract));

		return response.data;
	}

	public async update(developer: Developer, contract: Contract) {
		const url = `/rest/developers/${developer.Id}/contracts/${contract.Id}`;
		await this.$http.put<void>(url, this.encode(contract));
	}

	public async delete(developer: Developer, contract: Contract) {
		const url = `/rest/developers/${developer.Id}/contracts/${contract.Id}`;
		await this.$http.delete<void>(url);
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
