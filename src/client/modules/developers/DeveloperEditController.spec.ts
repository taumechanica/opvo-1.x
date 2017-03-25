import { auto, material, mock } from 'angular';
import { IControllerService, IQService, IScope } from 'angular';

import application from '../../application';
import mocks from '../mocks/config';

import { Deferred, FormController } from '../mocks/config';

import { Developer } from '../../domain/Developer';
import { DeveloperEditController } from './DeveloperEditController';
import { DevelopersService } from '../../data/DevelopersService';

describe('DeveloperEditController', () => {
	beforeEach(mock.module(application.name));
	beforeEach(mock.module(mocks.name));

	let $q: IQService;
	let $scope: IScope;
	let $controller: IControllerService;
	let $mdDialog: material.IDialogService;

	let developersService: DevelopersService;

	beforeEach(inject(($injector: auto.IInjectorService) => {
		$q = $injector.get('$q');
		$scope = $injector.get('$rootScope').$new();
		$controller = $injector.get('$controller');
		$mdDialog = $injector.get<material.IDialogService>('$mdDialog');

		developersService = $injector.get<DevelopersService>('developersService');
	}));

	const instantiate = (developer?: Developer) => {
		const $translate = (translationId: string) => $q.resolve(translationId);
		const ctrl = $controller(
			DeveloperEditController, {
				$scope,
				$translate,
				developer
			}
		);
		$scope.$digest();
		return ctrl;
	};

	const developer = {
		Id: 1,
		Name: '#1',
		CeilingAmount: 10.0
	};

	it('should init title and model according to action (new/edit)', () => {
		let ctrl = instantiate();
		expect(ctrl.title).toEqual('NEW_RECORD');
		expect(ctrl.developerModel).toBeUndefined();

		ctrl = instantiate(developer);
		expect(ctrl.title).toEqual('EDIT_RECORD');
		expect(ctrl.developerModel).toEqual(developer);
	});

	it('should hide the dialog after successful action', async done => {
		const deferred = new Deferred();
		spyOn(developersService, 'create').and.callFake(() => deferred.promise);
		spyOn($scope, '$apply').and.callFake(() => { });
		spyOn($mdDialog, 'hide').and.callFake(() => { });

		const ctrl = instantiate();
		ctrl.developerForm = new FormController();
		spyOn(ctrl.developerForm, '$setSubmitted').and.callThrough();

		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalled();
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.developerModel = developer;
		ctrl.developerForm.$setValidity(undefined, false, undefined);
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalled();
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.developerForm.$setValidity(undefined, true, undefined);
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalled();
		expect(ctrl.loading).toBeTruthy();
		expect(developersService.create).toHaveBeenCalledWith(developer);

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
		spyOn(developersService, 'update').and.callFake(() => deferred.promise);
		spyOn($scope, '$apply').and.callFake(() => { });
		spyOn($mdDialog, 'hide').and.callFake(() => { });

		const ctrl = instantiate(developer);
		ctrl.developerForm = new FormController();
		ctrl.developerForm.$setValidity(undefined, false, undefined);
		spyOn(ctrl.developerForm, '$setSubmitted').and.callThrough();

		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalled();
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.developerForm.$setValidity(undefined, true, undefined);
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalled();
		expect(ctrl.loading).toBeTruthy();
		expect(developersService.update).toHaveBeenCalledWith(developer);

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
