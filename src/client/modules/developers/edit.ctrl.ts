import * as ng from 'angular';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

export class EditDeveloperController {
	public developerForm: ng.IFormController;
	public developerModel: Developer;

	constructor(
		private $mdDialog: ng.material.IDialogService,
		private developersService: DevelopersService
	) {
		'ngInject';
	}

	public save() {
		if (ng.isUndefined(this.developerModel)) return;
		if (this.developerForm.$invalid) return;

		this.developersService
			.create(this.developerModel)
			.then(response => console.log(response))
			.catch(reason => console.log(reason));
	}

	public cancel() {
		this.$mdDialog.cancel();
	}
}
