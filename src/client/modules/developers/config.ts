import '../../assets/styles/developers.less';

import { module, translate, ui } from 'angular';

import { Template } from '../Template';

import { DevelopersController } from './list.ctrl';
import { DevelopersService } from '../../data/DevelopersService';

module('opvo.developers', [])
	.controller('developersController', DevelopersController)
	.service('developersService', DevelopersService)
	.config(($translatePartialLoaderProvider: translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('developers');
	})
	.config((
		$stateProvider: ui.IStateProvider,
		$urlRouterProvider: ui.IUrlRouterProvider
	) => {
		'ngInject';

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('developers', {
			url: '/',
			templateUrl: Template.getUrl('developers/list'),
			controller: 'developersController',
			controllerAs: 'ctrl'
		});
	});
