import { auto, material, mock } from 'angular';
import { IControllerService, IFormController, IQService, IScope } from 'angular';

import application from '../../application';
import mocks from '../mocks/config';

import { Deferred, Factory } from '../mocks/config';

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
		spyOn($scope, '$apply').and.callThrough();
		spyOn($mdDialog, 'hide').and.callThrough();

		const ctrl = instantiate();
		ctrl.developerForm = Factory<IFormController>({
			$invalid: false,
			$setSubmitted: jasmine.createSpy('$setSubmitted').and.callFake(() => { })
		});

		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalledTimes(1);
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.developerModel = developer;
		ctrl.developerForm.$invalid = true;
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalledTimes(2);
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.developerForm.$invalid = false;
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalledTimes(3);
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
		spyOn($scope, '$apply').and.callThrough();
		spyOn($mdDialog, 'hide').and.callThrough();

		const ctrl = instantiate(developer);
		ctrl.developerForm = Factory<IFormController>({
			$invalid: true,
			$setSubmitted: jasmine.createSpy('$setSubmitted').and.callFake(() => { })
		});

		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalledTimes(1);
		expect($scope.$apply).not.toHaveBeenCalled();

		ctrl.developerForm.$invalid = false;
		ctrl.save();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.developerForm.$setSubmitted).toHaveBeenCalledTimes(2);
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
		spyOn($mdDialog, 'cancel').and.callThrough();

		const ctrl = instantiate();
		ctrl.cancel();
		expect($mdDialog.cancel).toHaveBeenCalled();
	});
});
