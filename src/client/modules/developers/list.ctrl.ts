import '../../assets/styles/developers.less';

import { Template } from '../Template';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

import { EditDeveloperController } from './edit.ctrl';

export class DevelopersController {
	public loading: boolean;

	public developers: Developer[];

	constructor(
		private $mdDialog: ng.material.IDialogService,
		private developersService: DevelopersService
	) {
		'ngInject';

		this.loading = true;
		this.developersService
			.getAll()
			.then(response => {
				this.developers = response.data;
			})
			.finally(() => this.loading = false);
	}

	public openAddDialog(event: MouseEvent) {
		this.$mdDialog.show({
			templateUrl: Template.getUrl('developers/edit'),
			targetEvent: event,
			controller: EditDeveloperController,
			controllerAs: 'ctrl'
		});
	}
}
