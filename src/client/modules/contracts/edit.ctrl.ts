import * as ng from 'angular';

import { Contract } from '../../domain/Contract';
import { Developer } from '../../domain/Developer';

import { ContractsService } from '../../data/ContractsService';

export class EditContractController {
	public loading: boolean;

	public title: string;
	public error: { remote?: boolean; };

	public contractForm: ng.IFormController;
	public contractModel: Contract;

	constructor(
		private developer: Developer,
		private contract: Contract,
		private $mdDialog: ng.material.IDialogService,
		private $translate: ng.translate.ITranslateService,
		private contractsService: ContractsService
	) {
		'ngInject';

		if (contract) {
			this.contractModel = ng.extend({ }, contract);
			$translate('EDIT_RECORD').then(title => this.title = title);
		} else {
			$translate('NEW_RECORD').then(title => this.title = title);
		}
	}

	public save() {
		this.error = { };
		this.contractForm.$setSubmitted();

		if (ng.isUndefined(this.contractModel)) return;
		if (this.contractForm.$invalid) return;

		this.loading = true;

		const promise = this.contract ?
			this.contractsService.update(this.developer, this.contractModel) :
			this.contractsService.create(this.developer, this.contractModel);
		promise
			.then(() => this.$mdDialog.hide())
			.catch(() => this.error.remote = true)
			.finally(() => this.loading = false);
	}

	public cancel() {
		this.$mdDialog.cancel();
	}
}
