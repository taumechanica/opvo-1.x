import * as ng from 'angular';

import { Developer } from '../../domain/Developer';
import { Contract } from '../../domain/Contract';

import { ContractsService } from '../../data/ContractsService';

export class DeleteContractController {
	public loading: boolean;

	public translateData: { id: number; };
	public error: { remote?: boolean; };

	constructor(
		private developer: Developer,
		private contract: Contract,
		private $mdDialog: ng.material.IDialogService,
		private contractsService: ContractsService
	) {
		'ngInject';

		this.translateData = {
			id: contract.Id
		};
	}

	public delete() {
		this.error = { };

		this.loading = true;
		this.contractsService
			.delete(this.developer, this.contract)
			.then(() => this.$mdDialog.hide())
			.catch(() => this.error.remote = true)
			.finally(() => this.loading = false);
	}

	public cancel() {
		this.$mdDialog.cancel();
	}
}
