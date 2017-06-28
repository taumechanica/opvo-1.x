import { auto, material, mock } from 'angular';
import { IControllerService, IDocumentService, IQService, IScope } from 'angular';
import { StateParams } from '@uirouter/angularjs';

import application from '../../../application';
import mocks from '../../mocks/config';

import { Deferred, Factory } from '../../mocks/config';

import { Contract } from '../../../domain/Contract';
import { ContractsListController } from './ContractsListController';
import { ContractsService } from '../../../data/ContractsService';
import { SettingsService } from '../../../data/SettingsService';

describe('ContractsListController', () => {
	beforeEach(mock.module(application.name));
	beforeEach(mock.module(mocks.name));

	let $q: IQService;
	let $scope: IScope;
	let $document: IDocumentService;
	let $controller: IControllerService;
	let $mdDialog: material.IDialogService;

	let contractsService: ContractsService;
	let settingsService: SettingsService;

	beforeEach(inject(($injector: auto.IInjectorService) => {
		$q = $injector.get('$q');
		$scope = $injector.get('$rootScope').$new();
		$document = $injector.get('$document');
		$controller = $injector.get('$controller');
		$mdDialog = $injector.get<material.IDialogService>('$mdDialog');

		contractsService = $injector.get<ContractsService>('contractsService');
		settingsService = $injector.get<SettingsService>('settingsService');

		jasmine.clock().mockDate(new Date(1496307600000));
	}));

	const $state = {
		go: (to: string, params?: { }) => $q.resolve()
	};

	const developer = { Id: 1, Name: '#1', CeilingAmount: 10.0 };

	const instantiate = ($stateParams?: StateParams) => {
		const deferred = new Deferred<Contract[]>();
		spyOn(contractsService, 'getAllByYear').and.callFake(() => deferred.promise);

		$stateParams = $stateParams || new StateParams(developer);
		const ctrl = $controller(
			ContractsListController, {
				$scope,
				$state,
				$stateParams
			}
		);
		$scope.$digest();
		return { ctrl, deferred };
	};

	const createMouseEvent = () => $document[0].createEvent('MouseEvent');

	it('should redirect to developers list if developer was not provided', () => {
		spyOn($state, 'go').and.callThrough();

		const { ctrl } = instantiate(new StateParams());
		expect(ctrl.developer).toBeUndefined();
		expect($state.go).toHaveBeenCalledWith('developers');
	});

	it('should update data after edition', async done => {
		spyOn($mdDialog, 'show').and.callFake(() => Promise.resolve());

		const { ctrl, deferred } = instantiate();

		deferred.resolve([]);
		await deferred.promise;

		expect(contractsService.getAllByYear).toHaveBeenCalledTimes(1);

		const event = createMouseEvent();
		spyOn(event, 'stopPropagation').and.callThrough();

		deferred.reset();

		ctrl.openEditDialog(event, Factory<Contract>());
		expect(event.stopPropagation).toHaveBeenCalled();
		expect($mdDialog.show).toHaveBeenCalled();

		deferred.resolve([]);
		await deferred.promise;

		expect(contractsService.getAllByYear).toHaveBeenCalledTimes(2);

		done();
	});

	it('should update data after deletion', async done => {
		spyOn($mdDialog, 'show').and.callFake(() => Promise.resolve());

		const { ctrl, deferred } = instantiate();

		deferred.resolve([]);
		await deferred.promise;

		expect(contractsService.getAllByYear).toHaveBeenCalledTimes(1);

		const event = createMouseEvent();
		spyOn(event, 'stopPropagation').and.callThrough();

		deferred.reset();

		ctrl.openDeleteDialog(event, Factory<Contract>());
		expect(event.stopPropagation).toHaveBeenCalled();
		expect($mdDialog.show).toHaveBeenCalled();

		deferred.resolve([]);
		await deferred.promise;

		expect(contractsService.getAllByYear).toHaveBeenCalledTimes(2);

		done();
	});

	it('should update data after year selection', async done => {
		const { ctrl, deferred } = instantiate();

		deferred.resolve([]);
		await deferred.promise;

		expect(contractsService.getAllByYear).toHaveBeenCalledTimes(1);

		deferred.reset();
		ctrl.selectYear();
		deferred.resolve([]);
		await deferred.promise;

		expect(contractsService.getAllByYear).toHaveBeenCalledTimes(2);

		done();
	});

	describe('contracts data', () => {
		beforeEach(() => {
			spyOn($scope, '$apply').and.callThrough();
		});

		it('should init data on instantiation', async done => {
			const { ctrl, deferred } = instantiate();
			expect(ctrl.developer).toEqual(developer);
			expect(ctrl.selectedYear).toEqual(2017);
			expect(ctrl.loading).toBeTruthy();

			deferred.resolve([]);
			await deferred.promise;

			expect(ctrl.hasData).toBeFalsy();
			expect(ctrl.loading).toBeFalsy();
			expect($scope.$apply).toHaveBeenCalled();

			done();
		});

		it('should calculate sum and exceed status #1', async done => {
			const { ctrl, deferred } = instantiate();
			expect(ctrl.developer).toEqual(developer);
			expect(ctrl.selectedYear).toEqual(2017);
			expect(ctrl.loading).toBeTruthy();

			const contracts = [{
				Id: 1,
				DeveloperId: 1,
				Amount: 5.0,
				StartDate: new Date(1483261200000),
				Deadline: new Date(1498899600000)
			}, {
				Id: 2,
				DeveloperId: 1,
				Amount: 4.0,
				StartDate: new Date(1484038800000),
				Deadline: new Date(1489136400000)
			}];
			deferred.resolve(contracts);
			await deferred.promise;

			expect(ctrl.hasData).toBeTruthy();
			expect(ctrl.contractsByMonth.filter(month => month.contracts.length)).toEqual([
				{ month: 'JAN', contracts, sum: 9.0, exceeds: false }
			]);
			expect(ctrl.loading).toBeFalsy();
			expect($scope.$apply).toHaveBeenCalled();

			done();
		});

		it('should calculate sum and exceed status #2', async done => {
			const { ctrl, deferred } = instantiate();
			expect(ctrl.developer).toEqual(developer);
			expect(ctrl.selectedYear).toEqual(2017);
			expect(ctrl.loading).toBeTruthy();

			const contracts = [{
				Id: 1,
				DeveloperId: 1,
				Amount: 5.0,
				StartDate: new Date(1483261200000),
				Deadline: new Date(1498899600000)
			}, {
				Id: 2,
				DeveloperId: 1,
				Amount: 4.0,
				StartDate: new Date(1484038800000),
				Deadline: new Date(1489136400000)
			}, {
				Id: 3,
				DeveloperId: 1,
				Amount: 3.0,
				StartDate: new Date(1484470800000),
				Deadline: new Date(1492246800000)
			}];
			deferred.resolve(contracts);
			await deferred.promise;

			expect(ctrl.hasData).toBeTruthy();
			expect(ctrl.contractsByMonth.filter(month => month.contracts.length)).toEqual([
				{ month: 'JAN', contracts, sum: 12.0, exceeds: true }
			]);
			expect(ctrl.loading).toBeFalsy();
			expect($scope.$apply).toHaveBeenCalled();

			done();
		});

		it('should calculate sum and exceed status #3', async done => {
			const { ctrl, deferred } = instantiate();
			expect(ctrl.developer).toEqual(developer);
			expect(ctrl.selectedYear).toEqual(2017);
			expect(ctrl.loading).toBeTruthy();

			const contracts = [{
				Id: 1,
				DeveloperId: 1,
				Amount: 5.0,
				StartDate: new Date(1483261200000),
				Deadline: new Date(1498899600000)
			}, {
				Id: 2,
				DeveloperId: 1,
				Amount: 4.0,
				StartDate: new Date(1484038800000),
				Deadline: new Date(1489136400000),
				AcceptanceDate: new Date(1488704400000)
			}, {
				Id: 3,
				DeveloperId: 1,
				Amount: 3.0,
				StartDate: new Date(1484470800000),
				Deadline: new Date(1492246800000)
			}];
			deferred.resolve(contracts);
			await deferred.promise;

			expect(ctrl.hasData).toBeTruthy();
			expect(ctrl.contractsByMonth.filter(month => month.contracts.length)).toEqual([
				{ month: 'JAN', contracts, sum: 8.0, exceeds: false }
			]);
			expect(ctrl.loading).toBeFalsy();
			expect($scope.$apply).toHaveBeenCalled();

			done();
		});
	});

	describe('year options', () => {
		let getSettings: jasmine.Spy;

		beforeEach(() => {
			spyOn($scope, '$apply').and.callThrough();
			getSettings = spyOn(settingsService, 'get');
		});

		it('should fill options list according to settings', async done => {
			const deferred = new Deferred();
			getSettings.and.callFake(() => deferred.promise);

			const { ctrl } = instantiate();
			deferred.resolve({ YearFrom: 2016, YearTo: 2018 });
			await deferred.promise;

			expect(ctrl.yearOptions).toEqual([2016, 2017, 2018]);
			expect($scope.$apply).toHaveBeenCalled();

			done();
		});

		it('should add current year to the options from the right', async done => {
			const deferred = new Deferred();
			getSettings.and.callFake(() => deferred.promise);

			const { ctrl } = instantiate();
			deferred.resolve({ YearFrom: 2013, YearTo: 2015 });
			await deferred.promise;

			expect(ctrl.yearOptions).toEqual([2013, 2014, 2015, 2017]);
			expect($scope.$apply).toHaveBeenCalled();

			done();
		});

		it('should add current year to the options from the left', async done => {
			const deferred = new Deferred();
			getSettings.and.callFake(() => deferred.promise);

			const { ctrl } = instantiate();
			deferred.resolve({ YearFrom: 2018, YearTo: 2020 });
			await deferred.promise;

			expect(ctrl.yearOptions).toEqual([2017, 2018, 2019, 2020]);
			expect($scope.$apply).toHaveBeenCalled();

			done();
		});
	});
});
