import { auto, material, mock } from 'angular';
import { IControllerService, IScope } from 'angular';

import application from '../../../application';
import mocks from '../../mocks/config';

import { ContractDeleteController } from './ContractDeleteController';
import { ContractsService } from '../../../data/ContractsService';

describe('ContractDeleteController', () => {
	beforeEach(mock.module(application.name));
	beforeEach(mock.module(mocks.name));

	let $scope: IScope;
	let $controller: IControllerService;
	let $mdDialog: material.IDialogService;

	let contractsService: ContractsService;

	beforeEach(inject(($injector: auto.IInjectorService) => {
		$scope = $injector.get('$rootScope').$new();
		$controller = $injector.get('$controller');
		$mdDialog = $injector.get<material.IDialogService>('$mdDialog');

		contractsService = $injector.get<ContractsService>('contractsService');
	}));

	const developer = { Id: 1 };
	const contract = { Id: 2 };

	const instantiate = () => {
		const ctrl = $controller(
			ContractDeleteController, {
				$scope,
				developer,
				contract
			}
		);
		$scope.$digest();
		return ctrl;
	};

	it('should init translate data with contract id', () => {
		const ctrl = instantiate();
		expect(ctrl.translateData).toEqual({ id: contract.Id });
	});

	it('should hide the dialog after successful delete', async done => {
		spyOn(contractsService, 'delete').and.callFake(() => Promise.resolve());
		spyOn($scope, '$apply').and.callFake(() => { });
		spyOn($mdDialog, 'hide').and.callFake(() => { });

		const ctrl = instantiate();
		await ctrl.delete();

		expect(contractsService.delete).toHaveBeenCalledWith(developer, contract);
		expect($mdDialog.hide).toHaveBeenCalled();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});

	it('should show an error after failing delete', async done => {
		spyOn(contractsService, 'delete').and.callFake(() => Promise.reject({ }));
		spyOn($scope, '$apply').and.callFake(() => { });
		spyOn($mdDialog, 'hide').and.callFake(() => { });

		const ctrl = instantiate();
		await ctrl.delete();

		expect(contractsService.delete).toHaveBeenCalledWith(developer, contract);
		expect($mdDialog.hide).not.toHaveBeenCalled();
		expect(ctrl.error).toEqual({ remote: true });
		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});

	it('should cancel the dialog when cancelling deletion', () => {
		spyOn($mdDialog, 'cancel').and.callFake(() => { });

		const ctrl = instantiate();
		ctrl.cancel();
		expect($mdDialog.cancel).toHaveBeenCalled();
	});
});
