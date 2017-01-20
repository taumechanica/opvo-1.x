import '../../assets/styles/developers.less';

import { Template } from '../Template';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

export class DevelopersController {
	public developers: Developer[];

	constructor(
		private $mdDialog: ng.material.IDialogService,
		private developersService: DevelopersService
	) {
		'ngInject';

		this.developersService.getAll().then(response => {
			this.developers = response.data;
		});
	}

	public openAddDialog(event: MouseEvent) {
		this.$mdDialog.show({
			templateUrl: Template.getUrl('developers/edit'),
			targetEvent: event,
			controller: DevelopersController,
			controllerAs: 'ctrl'
		});
	}

	public cancelDialog() {
		this.$mdDialog.cancel();
	}
}
