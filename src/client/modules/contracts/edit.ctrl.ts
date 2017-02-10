import { extend, isUndefined, material, translate } from 'angular';
import { IFormController } from 'angular';

import { Contract } from '../../domain/Contract';
import { Developer } from '../../domain/Developer';

import { ContractsService } from '../../data/ContractsService';

export class EditContractController {
	public loading: boolean;

	public title: string;
	public error: { remote?: boolean; };

	public contractForm: IFormController;
	public contractModel: Contract;

	constructor(
		private developer: Developer,
		private contract: Contract,
		private $mdDialog: material.IDialogService,
		private $translate: translate.ITranslateService,
		private contractsService: ContractsService
	) {
		'ngInject';

		if (contract) {
			this.contractModel = extend({ }, contract);
			$translate('EDIT_RECORD').then(title => this.title = title);
		} else {
			$translate('NEW_RECORD').then(title => this.title = title);
		}
	}

	public async save() {
		this.error = { };
		this.contractForm.$setSubmitted();

		if (isUndefined(this.contractModel)) return;
		if (this.contractForm.$invalid) return;

		this.loading = true;

		try {
			const method = this.contract ?
				this.contractsService.update :
				this.contractsService.create;
			await method(this.developer, this.contractModel);

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
