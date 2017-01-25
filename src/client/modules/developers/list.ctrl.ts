import '../../assets/styles/developers.less';

import { Template } from '../Template';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

import { EditDeveloperController } from './edit.ctrl';
import { DeleteDeveloperController } from './delete.ctrl';

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

	public openEditDialog(event: MouseEvent, developer: Developer) {
		this.$mdDialog.show({
			templateUrl: Template.getUrl('developers/edit'),
			targetEvent: event,
			controller: EditDeveloperController,
			controllerAs: 'ctrl',
			locals: { developer }
		});
	}

	public openDeleteDialog(event: MouseEvent, developer: Developer) {
		this.$mdDialog.show({
			templateUrl: Template.getUrl('developers/delete'),
			targetEvent: event,
			controller: DeleteDeveloperController,
			controllerAs: 'ctrl',
			locals: { developer }
		});
	}
}
