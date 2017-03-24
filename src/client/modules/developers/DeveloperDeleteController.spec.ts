import { auto, material, mock } from 'angular';
import { IControllerService, IScope } from 'angular';

import application from '../../application';
import mocks from '../mocks/config';

import { Deferred } from '../mocks/config';

import { DeveloperDeleteController } from './DeveloperDeleteController';
import { DevelopersService } from '../../data/DevelopersService';

describe('DeveloperDeleteController', () => {
	beforeEach(mock.module(application.name));
	beforeEach(mock.module(mocks.name));

	let $scope: IScope;
	let $controller: IControllerService;
	let $mdDialog: material.IDialogService;

	let developersService: DevelopersService;

	beforeEach(inject(($injector: auto.IInjectorService) => {
		$scope = $injector.get('$rootScope').$new();
		$controller = $injector.get('$controller');
		$mdDialog = $injector.get<material.IDialogService>('$mdDialog');

		developersService = $injector.get<DevelopersService>('developersService');
	}));

	const developer = { Id: 1 };

	const instantiate = () => {
		const ctrl = $controller(
			DeveloperDeleteController, {
				$scope,
				developer
			}
		);
		$scope.$digest();
		return ctrl;
	};

	it('should init translate data with developer id', () => {
		const ctrl = instantiate();
		expect(ctrl.translateData).toEqual({ id: developer.Id });
	});

	it('should hide the dialog after successful delete', async done => {
		const deferred = new Deferred();
		spyOn(developersService, 'delete').and.callFake(() => deferred.promise);
		spyOn($scope, '$apply').and.callFake(() => { });
		spyOn($mdDialog, 'hide').and.callFake(() => { });

		const ctrl = instantiate();
		ctrl.delete();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.loading).toBeTruthy();
		expect(developersService.delete).toHaveBeenCalledWith(developer);

		deferred.resolve();
		await deferred.promise;

		expect($mdDialog.hide).toHaveBeenCalled();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});

	it('should show an error after failing delete', async done => {
		const deferred = new Deferred();
		spyOn(developersService, 'delete').and.callFake(() => deferred.promise);
		spyOn($scope, '$apply').and.callFake(() => { });
		spyOn($mdDialog, 'hide').and.callFake(() => { });

		const ctrl = instantiate();
		ctrl.delete();
		expect(ctrl.error).toEqual({ });
		expect(ctrl.loading).toBeTruthy();
		expect(developersService.delete).toHaveBeenCalledWith(developer);

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

	it('should cancel the dialog when cancelling deletion', () => {
		spyOn($mdDialog, 'cancel').and.callFake(() => { });

		const ctrl = instantiate();
		ctrl.cancel();
		expect($mdDialog.cancel).toHaveBeenCalled();
	});
});
