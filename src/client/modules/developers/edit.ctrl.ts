import { extend, isUndefined, material, translate } from 'angular';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

export class EditDeveloperController {
	public loading: boolean;

	public title: string;
	public error: { remote?: boolean; };

	public developerForm: ng.IFormController;
	public developerModel: Developer;

	constructor(
		private developer: Developer,
		private $mdDialog: material.IDialogService,
		private $translate: translate.ITranslateService,
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
			const method = this.developer ?
				this.developersService.update :
				this.developersService.create;
			await method(this.developerModel);

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
