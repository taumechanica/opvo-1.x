import { extend, isUndefined, material, translate } from 'angular';
import { IFormController, IScope } from 'angular';

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
		private $scope: IScope,
		private $mdDialog: material.IDialogService,
		private $translate: translate.ITranslateService,
		private developer: Developer,
		private contract: Contract,
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
			if (this.contract) {
				await this.contractsService.update(this.developer, this.contractModel);
			} else {
				await this.contractsService.create(this.developer, this.contractModel);
			}

			this.$mdDialog.hide();
		} catch (ex) {
			this.error.remote = true;
		} finally {
			this.loading = false;
			this.$scope.$apply();
		}
	}

	public cancel() {
		this.$mdDialog.cancel();
	}
}
