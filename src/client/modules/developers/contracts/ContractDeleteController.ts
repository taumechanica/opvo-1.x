import { material } from 'angular';
import { IScope } from 'angular';

import { Developer } from '../../../domain/Developer';
import { Contract } from '../../../domain/Contract';

import { ContractsService } from '../../../data/ContractsService';

export class ContractDeleteController {
    public loading: boolean;

    public translateData: { id: number; };
    public error: { remote?: boolean; };

    public constructor(
        private $scope: IScope,
        private $mdDialog: material.IDialogService,
        private developer: Developer,
        private contract: Contract,
        private contractsService: ContractsService
    ) {
        'ngInject';

        this.translateData = {
            id: contract.Id
        };
    }

    public async delete() {
        this.error = { };
        this.loading = true;

        try {
            await this.contractsService.delete(this.developer, this.contract);

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
