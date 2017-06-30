import { material } from 'angular';
import { IScope } from 'angular';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

export class DeveloperDeleteController {
    public loading: boolean;

    public translateData: { id: number; };
    public error: { remote?: boolean; };

    public constructor(
        private $scope: IScope,
        private $mdDialog: material.IDialogService,
        private developer: Developer,
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
            this.$scope.$apply();
        }
    }

    public cancel() {
        this.$mdDialog.cancel();
    }
}
