import { auto, mock, translate } from 'angular';
import { IControllerService, IFormController, INgModelController, IScope } from 'angular';

import application from '../../application';
import mocks from '../mocks/config';

import { Deferred, Factory } from '../mocks/config';

import { Settings } from '../../domain/Settings';
import { SettingsController } from './SettingsController';
import { SettingsService } from '../../data/SettingsService';

describe('SettingsController', () => {
	beforeEach(mock.module(application.name));
	beforeEach(mock.module(mocks.name));

	let $scope: IScope;
	let $controller: IControllerService;
	let $translate: translate.ITranslateProvider;

	let settingsService: SettingsService;

	beforeEach(inject(($injector: auto.IInjectorService) => {
		$scope = $injector.get('$rootScope').$new();
		$controller = $injector.get('$controller');
		$translate = $injector.get<translate.ITranslateProvider>('$translate');

		settingsService = $injector.get<SettingsService>('settingsService');
	}));

	const instantiate = () => {
		const get = new Deferred<Settings>();
		spyOn(settingsService, 'get').and.callFake(() => get.promise);

		const ctrl = $controller(
			SettingsController, {
				$scope
			}
		);
		$scope.$digest();
		return { ctrl, get };
	};

	const settings = { Language: 'ru', YearFrom: 2017, YearTo: 2017 };

	it('should init data on instantiation', async done => {
		spyOn($scope, '$apply').and.callThrough();

		const { ctrl, get } = instantiate();
		expect(ctrl.settingsModel).toBeUndefined();
		expect(ctrl.loading).toBeTruthy();

		get.resolve(settings);
		await get.promise;

		expect(settingsService.get).toHaveBeenCalled();
		expect(ctrl.settingsModel).toEqual(settings);
		expect(ctrl.loading).toBeFalsy();
		expect($scope.$apply).toHaveBeenCalled();

		done();
	});

	it('should save settings on language selection', async done => {
		const set = new Deferred<void>();
		spyOn(settingsService, 'set').and.callFake(() => set.promise);
		spyOn($scope, '$apply').and.callThrough();
		spyOn($translate, 'use').and.callThrough();

		const { ctrl, get } = instantiate();
		get.resolve(settings);
		await get.promise;

		expect($scope.$apply).toHaveBeenCalledTimes(1);

		ctrl.settingsModel.Language = 'en';
		ctrl.selectLanguage();

		set.resolve();
		await set.promise;

		expect(settingsService.set).toHaveBeenCalledWith(ctrl.settingsModel);
		expect($translate.use).toHaveBeenCalledWith('en');
		expect($scope.$apply).toHaveBeenCalledTimes(2);

		done();
	});

	it('should validate range of years', async done => {
		spyOn(settingsService, 'set').and.callFake(() => { });

		const { ctrl, get } = instantiate();
		get.resolve(settings);
		await get.promise;

		const from = Factory<INgModelController>({
			$name: 'from',
			$valid: true,
			$setValidity: jasmine
				.createSpy('$setValidity').and
				.callFake((validationErrorKey: string, isValid: boolean) => {
					from.$valid = isValid;
					ctrl.settingsForm.$setValidity(validationErrorKey, isValid, from);
				})
		});
		const to = Factory<INgModelController>({
			$name: 'to',
			$valid: true,
			$setValidity: jasmine
				.createSpy('$setValidity').and
				.callFake((validationErrorKey: string, isValid: boolean) => {
					to.$valid = isValid;
					ctrl.settingsForm.$setValidity(validationErrorKey, isValid, to);
				})
		});
		ctrl.settingsForm = Factory<IFormController>({
			$invalid: false,
			$setSubmitted: jasmine.createSpy('$setSubmitted').and.callFake(() => { }),
			$setValidity: () => {
				ctrl.settingsForm.$invalid = !from.$valid || !to.$valid;
			},
			from, to
		});

		ctrl.settingsModel.YearFrom = 2016;
		ctrl.selectRange(from);
		expect(ctrl.settingsForm.$setSubmitted).toHaveBeenCalled();
		expect(from.$setValidity).toHaveBeenCalledWith('range', true);
		expect(to.$setValidity).toHaveBeenCalledWith('range', true);
		expect(settingsService.set).toHaveBeenCalledTimes(1);

		ctrl.settingsModel.YearFrom = 2018;
		ctrl.selectRange(from);
		expect(ctrl.settingsForm.$setSubmitted).toHaveBeenCalled();
		expect(from.$setValidity).toHaveBeenCalledWith('range', false);
		expect(to.$setValidity).toHaveBeenCalledWith('range', true);
		expect(settingsService.set).toHaveBeenCalledTimes(1);

		ctrl.settingsModel.YearTo = 2016;
		ctrl.selectRange(to);
		expect(ctrl.settingsForm.$setSubmitted).toHaveBeenCalled();
		expect(to.$setValidity).toHaveBeenCalledWith('range', false);
		expect(from.$setValidity).toHaveBeenCalledWith('range', true);
		expect(settingsService.set).toHaveBeenCalledTimes(1);

		ctrl.settingsModel.YearTo = 2019;
		ctrl.selectRange(to);
		expect(ctrl.settingsForm.$setSubmitted).toHaveBeenCalled();
		expect(to.$setValidity).toHaveBeenCalledWith('range', true);
		expect(from.$setValidity).toHaveBeenCalledWith('range', true);
		expect(settingsService.set).toHaveBeenCalledTimes(2);

		done();
	});
});
