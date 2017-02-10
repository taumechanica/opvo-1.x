import { material } from 'angular';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

export class DeleteDeveloperController {
	public loading: boolean;

	public translateData: { id: number; };
	public error: { remote?: boolean; };

	constructor(
		private developer: Developer,
		private $mdDialog: material.IDialogService,
		private developersService: DevelopersService
	) {
		'ngInject';

		this.translateData = {
			id: developer.Id
		};
	}

	public async delete() {
		this.error = { };
		this.loading = true;

		try {
			await this.developersService.delete(this.developer);

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
