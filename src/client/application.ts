import './application.pug';
import './assets/styles/default.less';

import * as angular from 'angular';

import { DevelopersController } from './developers/list.controller';

const getTemplateUrl = (id: string) => {
	require(`./${id}.pug`);
	return `/tpl/${id}.html`;
};

angular
	.module('Opvo', ['ui.router'])
	.controller('DevelopersController', DevelopersController)
	.config((
		$stateProvider: angular.ui.IStateProvider,
		$urlRouterProvider: angular.ui.IUrlRouterProvider
	) => {
		'ngInject';

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('root', {
			url: '/',
			templateUrl: getTemplateUrl('developers/list'),
			controller: 'DevelopersController'
		});
	});
