import { Template } from '../Template';

import { Contract } from '../../domain/Contract';
import { Developer } from '../../domain/Developer';

import { ContractsService } from '../../data/ContractsService';

import { DeleteContractController } from './delete.ctrl';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export class ContractsStateParams
implements ng.ui.IStateParamsService {
	public developer: Developer;

	constructor() {
		this.developer = null;
	}
}

export class ContractsController {
	public loading: boolean;

	public developer: Developer;
	public year: number;
	public hasData: boolean;

	public contractsByMonth: {
		month: string;
		contracts: Contract[];
		sum: number;
		exceeds: boolean;
	}[];

	constructor(
		private $state: ng.ui.IStateService,
		private $stateParams: ContractsStateParams,
		private $mdDialog: ng.material.IDialogService,
		private contractsService: ContractsService
	) {
		'ngInject';

		this.developer = $stateParams.developer;
		if (!this.developer) {
			$state.go('developers');
			return;
		}

		this.year = new Date().getFullYear();
		this.loadData();
	}

	public openEditDialog(event: MouseEvent, contract: Contract) {
		event.stopPropagation();
	}

	public openDeleteDialog(event: MouseEvent, contract: Contract) {
		event.stopPropagation();

		const { developer } = this;
		this.$mdDialog.show({
			templateUrl: Template.getUrl('contracts/delete'),
			targetEvent: event,
			controller: DeleteContractController,
			controllerAs: 'ctrl',
			locals: { developer, contract }
		})
		.then(() => this.loadData())
		.catch(() => { });
	}

	private loadData() {
		this.loading = true;
		this.contractsService
			.getAllByYear(this.developer, this.year)
			.then(response => {
				this.hasData = response.data.length > 0;
				this.contractsByMonth = MONTHS.map(month => (
					{ month, contracts: [], sum: 0.0, exceeds: false }
				));
				response.data.forEach(contract => {
					const index = new Date(contract.StartDate).getMonth();
					const batch = this.contractsByMonth[index];
					batch.contracts.push(contract);
					if (!contract.AcceptanceDate) {
						batch.sum += contract.Amount;
					}
				});
				MONTHS.forEach((month, index) => {
					const batch = this.contractsByMonth[index];
					batch.exceeds = batch.sum > this.developer.CeilingAmount;
				});
			})
			.finally(() => this.loading = false);
	}
}
