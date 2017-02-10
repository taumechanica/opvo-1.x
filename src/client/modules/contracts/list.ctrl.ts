import { material, ui } from 'angular';

import { Template } from '../Template';

import { Contract } from '../../domain/Contract';
import { Developer } from '../../domain/Developer';

import { ContractsService } from '../../data/ContractsService';

import { EditContractController } from './edit.ctrl';
import { DeleteContractController } from './delete.ctrl';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export class ContractsStateParams implements ui.IStateParamsService {
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
		private $state: ui.IStateService,
		private $stateParams: ContractsStateParams,
		private $mdDialog: material.IDialogService,
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

	public async openEditDialog(event: MouseEvent, contract: Contract) {
		event.stopPropagation();

		try {
			const { developer } = this;
			await this.$mdDialog.show({
				templateUrl: Template.getUrl('contracts/edit'),
				targetEvent: event,
				controller: EditContractController,
				controllerAs: 'ctrl',
				locals: { developer, contract }
			});

			this.loadData();
		} catch (ex) { }
	}

	public async openDeleteDialog(event: MouseEvent, contract: Contract) {
		event.stopPropagation();

		try {
			const { developer } = this;
			await this.$mdDialog.show({
				templateUrl: Template.getUrl('contracts/delete'),
				targetEvent: event,
				controller: DeleteContractController,
				controllerAs: 'ctrl',
				locals: { developer, contract }
			});

			this.loadData();
		} catch (ex) { }
	}

	private async loadData() {
		this.loading = true;

		try {
			const data = await this.contractsService.getAllByYear(this.developer, this.year);

			this.hasData = data.length > 0;
			this.contractsByMonth = MONTHS.map(month => (
				{ month, contracts: [], sum: 0.0, exceeds: false }
			));
			data.forEach(contract => {
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
		} finally {
			this.loading = false;
		}
	}
}
