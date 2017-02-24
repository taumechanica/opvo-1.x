import { material, translate } from 'angular';
import { extend, isUndefined } from 'angular';
import { IFormController, IScope } from 'angular';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

export class EditDeveloperController {
	public loading: boolean;

	public title: string;
	public error: { remote?: boolean; };

	public developerForm: IFormController;
	public developerModel: Developer;

	constructor(
		private $scope: IScope,
		private $mdDialog: material.IDialogService,
		private $translate: translate.ITranslateService,
		private developer: Developer,
		private developersService: DevelopersService
	) {
		'ngInject';

		if (developer) {
			this.developerModel = extend({ }, developer);
			$translate('EDIT_RECORD').then(title => this.title = title);
		} else {
			$translate('NEW_RECORD').then(title => this.title = title);
		}
	}

	public async save() {
		this.error = { };
		this.developerForm.$setSubmitted();

		if (isUndefined(this.developerModel)) return;
		if (this.developerForm.$invalid) return;

		this.loading = true;

		try {
			if (this.developer) {
				await this.developersService.update(this.developerModel);
			} else {
				await this.developersService.create(this.developerModel);
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
