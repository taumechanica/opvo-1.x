import '../../assets/styles/developers.less';

import * as ng from 'angular';

import { Template } from '../Template';

import { DevelopersController } from './list.ctrl';
import { DevelopersService } from '../../data/DevelopersService';

ng
	.module('opvo.developers', [])
	.controller('developersController', DevelopersController)
	.service('developersService', DevelopersService)
	.config(($translatePartialLoaderProvider: ng.translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('developers');
	})
	.config((
		$stateProvider: ng.ui.IStateProvider,
		$urlRouterProvider: ng.ui.IUrlRouterProvider
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
