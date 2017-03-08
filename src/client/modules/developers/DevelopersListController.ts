import { material, ui } from 'angular';
import { IScope } from 'angular';

import { Template } from '../Template';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

import { DeveloperEditController } from './DeveloperEditController';
import { DeveloperDeleteController } from './DeveloperDeleteController';

export class DevelopersListController {
	public loading: boolean;

	public developers: Developer[];
	public filter: string;

	constructor(
		private $scope: IScope,
		private $state: ui.IStateService,
		private $mdDialog: material.IDialogService,
		private developersService: DevelopersService
	) {
		'ngInject';

		this.loadData();
	}

	public openContracts(event: MouseEvent, developer: Developer) {
		this.$state.go('developers.contracts', { developer });
	}

	public async openEditDialog(event: MouseEvent, developer: Developer) {
		event.stopPropagation();

		try {
			await this.$mdDialog.show({
				templateUrl: Template.getUrl('developers/DeveloperEdit'),
				targetEvent: event,
				controller: DeveloperEditController,
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
				templateUrl: Template.getUrl('developers/DeveloperDelete'),
				targetEvent: event,
				controller: DeveloperDeleteController,
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
			this.$scope.$apply();
		}
	}
}
