import { material, ui } from 'angular';

import { Template } from '../Template';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

import { EditDeveloperController } from './edit.ctrl';
import { DeleteDeveloperController } from './delete.ctrl';

export class DevelopersController {
	public loading: boolean;

	public developers: Developer[];

	constructor(
		private $state: ui.IStateService,
		private $mdDialog: material.IDialogService,
		private developersService: DevelopersService
	) {
		'ngInject';

		this.loadData();
	}

	public openContracts(event: MouseEvent, developer: Developer) {
		this.$state.go('contracts', { developer });
	}

	public async openEditDialog(event: MouseEvent, developer: Developer) {
		event.stopPropagation();

		try {
			await this.$mdDialog.show({
				templateUrl: Template.getUrl('developers/edit'),
				targetEvent: event,
				controller: EditDeveloperController,
				controllerAs: 'ctrl',
				locals: { developer }
			});

			this.loadData();
		} catch (ex) { }
	}

	public async openDeleteDialog(event: MouseEvent, developer: Developer) {
		event.stopPropagation();

		try {
			await this.$mdDialog.show({
				templateUrl: Template.getUrl('developers/delete'),
				targetEvent: event,
				controller: DeleteDeveloperController,
				controllerAs: 'ctrl',
				locals: { developer }
			});

			this.loadData();
		} catch (ex) { }
	}

	private async loadData() {
		this.loading = true;

		try {
			this.developers = await this.developersService.getAll();
		} finally {
			this.loading = false;
		}
	}
}
