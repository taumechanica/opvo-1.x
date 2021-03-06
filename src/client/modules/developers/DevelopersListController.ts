import { material } from 'angular';
import { IScope } from 'angular';
import { StateService } from '@uirouter/angularjs';

import { Template } from '../Template';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

import { DeveloperEditController } from './DeveloperEditController';
import { DeveloperDeleteController } from './DeveloperDeleteController';

export class DevelopersListController {
    public loading: boolean;

    public developers: Developer[];
    public filter: string;

    public constructor(
        private $scope: IScope,
        private $state: StateService,
        private $mdDialog: material.IDialogService,
        private developersService: DevelopersService
    ) {
        'ngInject';

        this.loadData();
    }

    public openContracts(event: MouseEvent, developer: Developer) {
        this.$state.go('developers.contracts', { developerId: developer.Id });
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
        } catch (ex) {
        } finally {
            this.loading = false;
            this.$scope.$apply();
        }
    }
}
