import { material } from 'angular';
import { IScope } from 'angular';
import { StateParams, StateService } from '@uirouter/angularjs';

import { Template } from '../../Template';

import { Contract } from '../../../domain/Contract';
import { Developer } from '../../../domain/Developer';

import { ContractsService } from '../../../data/ContractsService';
import { SettingsService } from '../../../data/SettingsService';

import { ContractEditController } from './ContractEditController';
import { ContractDeleteController } from './ContractDeleteController';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export class ContractsListController {
	public loading: boolean;

	public selectedYear: number;
	public yearOptions: number[];
	public hasData: boolean;

	public contractsByMonth: {
		month: string;
		contracts: Contract[];
		sum: number;
		exceeds: boolean;
	}[];

	public constructor(
		private $scope: IScope,
		private $state: StateService,
		private $stateParams: StateParams,
		private $mdDialog: material.IDialogService,
		private contractsService: ContractsService,
		private settingsService: SettingsService,
		public developer: Developer
	) {
		'ngInject';

		if (!developer) {
			$state.go('developers');
			return;
		}

		this.selectedYear = new Date().getFullYear();

		this.loadData();
		this.fillYearOptions();
	}

	public async openEditDialog(event: MouseEvent, contract: Contract) {
		event.stopPropagation();

		try {
			const { developer } = this;
			await this.$mdDialog.show({
				templateUrl: Template.getUrl('developers/contracts/ContractEdit'),
				targetEvent: event,
				controller: ContractEditController,
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
				templateUrl: Template.getUrl('developers/contracts/ContractDelete'),
				targetEvent: event,
				controller: ContractDeleteController,
				controllerAs: 'ctrl',
				locals: { developer, contract }
			});

			this.loadData();
		} catch (ex) { }
	}

	public selectYear() {
		this.loadData();
	}

	private async loadData() {
		this.loading = true;

		try {
			const data = await this.contractsService.getAllByYear(this.developer, this.selectedYear);

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
			this.$scope.$apply();
		}
	}

	private async fillYearOptions() {
		this.yearOptions = [];

		const { selectedYear, yearOptions } = this;

		try {
			const settings = await this.settingsService.get();
			const { YearFrom, YearTo } = settings;

			if (YearFrom > selectedYear) {
				yearOptions.push(selectedYear);
			}
			for (let year = YearFrom; year <= YearTo; year += 1) {
				yearOptions.push(year);
			}
			if (YearTo < selectedYear) {
				yearOptions.push(selectedYear);
			}
		} finally {
			this.$scope.$apply();
		}
	}
}
