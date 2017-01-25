import * as ng from 'angular';

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
		private $mdDialog: ng.material.IDialogService,
		private $translate: ng.translate.ITranslateService,
		private developersService: DevelopersService
	) {
		'ngInject';

		if (developer) {
			this.developerModel = ng.extend({ }, developer);
			$translate('EDIT_RECORD').then(title => this.title = title);
		} else {
			$translate('NEW_RECORD').then(title => this.title = title);
		}
	}

	public save() {
		this.error = { };
		this.developerForm.$setSubmitted();

		if (ng.isUndefined(this.developerModel)) return;
		if (this.developerForm.$invalid) return;

		this.loading = true;

		const promise = this.developer ?
			this.developersService.update(this.developerModel) :
			this.developersService.create(this.developerModel);
		promise
			.then(() => this.$mdDialog.hide())
			.catch(() => this.error.remote = true)
			.finally(() => this.loading = false);
	}

	public cancel() {
		this.$mdDialog.cancel();
	}
}
