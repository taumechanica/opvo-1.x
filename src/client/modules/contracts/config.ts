import '../../assets/styles/contracts.less';

import * as ng from 'angular';

import { Template } from '../Template';

import { ContractsStateParams, ContractsController } from './list.ctrl';
import { ContractsService } from '../../data/ContractsService';

ng
	.module('opvo.contracts', [])
	.controller('contractsController', ContractsController)
	.service('contractsService', ContractsService)
	.config(($translatePartialLoaderProvider: ng.translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('contracts');
	})
	.config((
		$stateProvider: ng.ui.IStateProvider,
		$urlRouterProvider: ng.ui.IUrlRouterProvider
	) => {
		'ngInject';

		$stateProvider.state('contracts', {
			url: '/contracts',
			params: new ContractsStateParams(),
			templateUrl: Template.getUrl('contracts/list'),
			controller: 'contractsController',
			controllerAs: 'ctrl'
		});
	});
