import { material } from 'angular';

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
		private $mdDialog: material.IDialogService,
		private contractsService: ContractsService
	) {
		'ngInject';

		this.translateData = {
			id: contract.Id
		};
	}

	public async delete() {
		this.error = { };
		this.loading = true;

		try {
			await this.contractsService.delete(this.developer, this.contract);

			this.$mdDialog.hide();
		} catch (ex) {
			this.error.remote = true;
		} finally {
			this.loading = false;
		}
	}

	public cancel() {
		this.$mdDialog.cancel();
	}
}
