import '../../assets/styles/contracts.less';

import { module, translate, ui } from 'angular';

import { Template } from '../Template';

import { ContractsStateParams, ContractsController } from './list.ctrl';
import { ContractsService } from '../../data/ContractsService';

module('opvo.contracts', [])
	.controller('contractsController', ContractsController)
	.service('contractsService', ContractsService)
	.config(($translatePartialLoaderProvider: translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('contracts');
	})
	.config((
		$stateProvider: ui.IStateProvider,
		$urlRouterProvider: ui.IUrlRouterProvider
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
