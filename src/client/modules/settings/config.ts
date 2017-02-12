import '../../assets/styles/settings.less';

import { module, translate, ui } from 'angular';

import { Template } from '../Template';

import { SettingsController } from './settings.ctrl';
import { SettingsService } from '../../data/SettingsService';

const setLanguage = async (
	$translate: translate.ITranslateProvider,
	settingsService: SettingsService
) => {
	const settings = await settingsService.get();
	$translate.use(settings.Language);
};

module('opvo.settings', [])
	.controller('settingsController', SettingsController)
	.service('settingsService', SettingsService)
	.config(($translatePartialLoaderProvider: translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('settings');
	})
	.config((
		$stateProvider: ui.IStateProvider,
		$urlRouterProvider: ui.IUrlRouterProvider
	) => {
		'ngInject';

		$stateProvider.state('settings', {
			url: '/settings',
			templateUrl: Template.getUrl('settings/settings'),
			controller: 'settingsController',
			controllerAs: 'ctrl'
		});
	})
	.run((
		$translate: translate.ITranslateProvider,
		settingsService: SettingsService
	) => {
		'ngInject';

		setLanguage($translate, settingsService);
	});
