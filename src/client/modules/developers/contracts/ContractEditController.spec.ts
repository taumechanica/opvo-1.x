import { auto, material, mock } from 'angular';
import { IControllerService, IQService, IScope } from 'angular';

import application from '../../../application';
import mocks from '../../mocks/config';

import { Deferred, FormController } from '../../mocks/config';

import { Contract } from '../../../domain/Contract';
import { ContractEditController } from './ContractEditController';
import { ContractsService } from '../../../data/ContractsService';

describe('ContractEditController', () => {
	beforeEach(mock.module(application.name));
	beforeEach(mock.module(mocks.name));

	let $q: IQService;
	let $scope: IScope;
	let $controller: IControllerService;
	let $mdDialog: material.IDialogService;

	let contractsService: ContractsService;

	beforeEach(inject(($injector: auto.IInjectorService) => {
		$q = $injector.get('$q');
		$scope = $injector.get('$rootScope').$new();
		$controller = $injector.get('$controller');
		$mdDialog = $injector.get<material.IDialogService>('$mdDialog');

		contractsService = $injector.get<ContractsService>('contractsService');
	}));

	const developer = {
		Id: 1,
		Name: '#1',
		CeilingAmount: 10.0
	};

	const contract = {
		Id: 2,
		DeveloperId: developer.Id,
		Amount: 5.0,
		StartDate: new Date(1483261200000),
		Deadline: new Date(1514710800000)
	};

	const instantiate = (contract?: Contract) => {
		const $translate = (translationId: string) => $q.resolve(translationId);
		const ctrl = $controller(
			ContractEditController, {
				$scope,
				$translate,
				developer,
				contract
			}
		);
		$scope.$digest();
		return ctrl;
	};

	it('should init title and model according to action (new/edit)', () => {
		let ctrl = instantiate();
		expect(ctrl.title).toEqual('NEW_RECORD');
		expect(ctrl.contractModel).toBeUndefined();

		ctrl = instantiate(contract);
		expect(ctrl.title).toEqual('EDIT_RECORD');
		expect(ctrl.contractModel).toEqual(contract);
	});

	it('should hide the dialog after successful action', async done => {
		const deferred = new Deferred();
		spyOn(contractsService, 'create').and.callFake(() => deferred.promise);
		spyOn($scope, '$apply').and.callFake(() => { });
		spyOn($mdDialog, 'hide').and.callFake(() => { });

		const ctrl = instantiate();
		ctrl.contractForm = new FormController();
		spyOn(ctrl.contractForm, '$setSubmitted').and.callThrough();

		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.contractForm.$setSubmitted).toHaveBeenCalled();
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.contractModel = contract;
		ctrl.contractForm.$setValidity(undefined, false, undefined);
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.contractForm.$setSubmitted).toHaveBeenCalled();
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.contractForm.$setValidity(undefined, true, undefined);
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.contractForm.$setSubmitted).toHaveBeenCalled();
		expect(ctrl.loading).toBeTruthy();
		expect(contractsService.create).toHaveBeenCalledWith(developer, contract);

		deferred.resolve();
		await deferred.promise;

		expect($mdDialog.hide).toHaveBeenCalled();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});

	it('should show an error after failing action', async done => {
		const deferred = new Deferred();
		spyOn(contractsService, 'update').and.callFake(() => deferred.promise);
		spyOn($scope, '$apply').and.callFake(() => { });
		spyOn($mdDialog, 'hide').and.callFake(() => { });

		const ctrl = instantiate(contract);
		ctrl.contractForm = new FormController();
		ctrl.contractForm.$setValidity(undefined, false, undefined);
		spyOn(ctrl.contractForm, '$setSubmitted').and.callThrough();

		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.contractForm.$setSubmitted).toHaveBeenCalled();
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.contractForm.$setValidity(undefined, true, undefined);
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.contractForm.$setSubmitted).toHaveBeenCalled();
		expect(ctrl.loading).toBeTruthy();
		expect(contractsService.update).toHaveBeenCalledWith(developer, contract);

		try {
			deferred.reject();
			await deferred.promise;
		} catch (ex) { }

		expect($mdDialog.hide).not.toHaveBeenCalled();
		expect(ctrl.error).toEqual({ remote: true });
		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});

	it('should cancel the dialog when cancelling action', () => {
		spyOn($mdDialog, 'cancel').and.callFake(() => { });

		const ctrl = instantiate();
		ctrl.cancel();
		expect($mdDialog.cancel).toHaveBeenCalled();
	});
});
