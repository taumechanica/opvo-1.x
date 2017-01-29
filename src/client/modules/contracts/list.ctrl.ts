import { Contract } from '../../domain/Contract';
import { Developer } from '../../domain/Developer';

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
	public contracts: Contract[];

	constructor(
		private $state: ng.ui.IStateService,
		private $stateParams: ContractsStateParams,
		private $mdDialog: ng.material.IDialogService
	) {
		'ngInject';

		this.developer = $stateParams.developer;
		if (!this.developer) {
			$state.go('developers');
		}
	}
}
