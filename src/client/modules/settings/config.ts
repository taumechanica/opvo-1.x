import '../../assets/styles/settings.less';

import { translate } from 'angular';
import { module } from 'angular';
import { StateProvider, UrlRouterProvider } from '@uirouter/angularjs';

import { Template } from '../Template';

import { SettingsController } from './SettingsController';
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
		$stateProvider: StateProvider,
		$urlRouterProvider: UrlRouterProvider
	) => {
		'ngInject';

		$stateProvider.state('settings', {
			url: '/settings',
			templateUrl: Template.getUrl('settings/Settings'),
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
