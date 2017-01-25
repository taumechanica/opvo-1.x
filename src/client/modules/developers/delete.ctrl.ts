import * as ng from 'angular';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

export class DeleteDeveloperController {
	public loading: boolean;

	public translateData: { id: number; };
	public error: { remote?: boolean; };

	constructor(
		private developer: Developer,
		private $mdDialog: ng.material.IDialogService,
		private developersService: DevelopersService
	) {
		'ngInject';

		this.translateData = {
			id: developer.Id
		};
	}

	public delete() {
		this.error = { };

		this.loading = true;
		this.developersService
			.delete(this.developer)
			.then(() => this.$mdDialog.hide())
			.catch(() => this.error.remote = true)
			.finally(() => this.loading = false);
	}

	public cancel() {
		this.$mdDialog.cancel();
	}
}
