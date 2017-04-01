import { auto, material, mock } from 'angular';
import { IControllerService, IDocumentService, IQService, IScope } from 'angular';

import application from '../../application';
import mocks from '../mocks/config';

import { Deferred } from '../mocks/config';

import { Developer } from '../../domain/Developer';
import { DevelopersListController } from './DevelopersListController';
import { DevelopersService } from '../../data/DevelopersService';

describe('DevelopersListController', () => {
	beforeEach(mock.module(application.name));
	beforeEach(mock.module(mocks.name));

	let $q: IQService;
	let $scope: IScope;
	let $document: IDocumentService;
	let $controller: IControllerService;
	let $mdDialog: material.IDialogService;

	let developersService: DevelopersService;

	beforeEach(inject(($injector: auto.IInjectorService) => {
		$q = $injector.get('$q');
		$scope = $injector.get('$rootScope').$new();
		$document = $injector.get('$document');
		$controller = $injector.get('$controller');
		$mdDialog = $injector.get<material.IDialogService>('$mdDialog');

		developersService = $injector.get<DevelopersService>('developersService');
	}));

	const $state = {
		go: (to: string, params?: { }) => $q.resolve()
	};

	const instantiate = () => {
		const deferred = new Deferred<Developer[]>();
		spyOn(developersService, 'getAll').and.callFake(() => deferred.promise);

		const ctrl = $controller(
			DevelopersListController, {
				$scope,
				$state
			}
		);
		$scope.$digest();
		return { ctrl, deferred };
	};

	const createMouseEvent = () => $document[0].createEvent('MouseEvent');

	const developers = [
		{ Id: 1, Name: '#1', CeilingAmount: 25.0 },
		{ Id: 2, Name: '#2', CeilingAmount: 50.0 }
	];

	it('should init data on instantiation', async done => {
		spyOn($scope, '$apply').and.callThrough();

		const { ctrl, deferred } = instantiate();
		expect(ctrl.loading).toBeTruthy();

		deferred.resolve(developers);
		await deferred.promise;

		expect(ctrl.developers).toEqual(developers);
		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});

	it('should redirect to contracts list', () => {
		spyOn($state, 'go').and.callThrough();

		const { ctrl } = instantiate();
		ctrl.openContracts(createMouseEvent(), developers[0]);
		expect($state.go).toHaveBeenCalledWith('developers.contracts', { developer: developers[0] });
	});

	it('should update data after edition', async done => {
		spyOn($mdDialog, 'show').and.callFake(() => Promise.resolve());
		spyOn($scope, '$apply').and.callThrough();

		const { ctrl, deferred } = instantiate();
		const event = createMouseEvent();
		spyOn(event, 'stopPropagation').and.callThrough();

		ctrl.openEditDialog(event, developers[0]);
		expect(event.stopPropagation).toHaveBeenCalled();
		expect($mdDialog.show).toHaveBeenCalled();
		expect(ctrl.loading).toBeTruthy();

		deferred.resolve(developers);
		await deferred.promise;

		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});

	it('should update data after deletion', async done => {
		spyOn($mdDialog, 'show').and.callFake(() => Promise.resolve());
		spyOn($scope, '$apply').and.callThrough();

		const { ctrl, deferred } = instantiate();
		const event = createMouseEvent();
		spyOn(event, 'stopPropagation').and.callThrough();

		ctrl.openDeleteDialog(event, developers[0]);
		expect(event.stopPropagation).toHaveBeenCalled();
		expect($mdDialog.show).toHaveBeenCalled();
		expect(ctrl.loading).toBeTruthy();

		deferred.resolve(developers);
		await deferred.promise;

		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});
});
