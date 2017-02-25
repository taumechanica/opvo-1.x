import '../../assets/styles/developers.less';
import '../../assets/styles/contracts.less';

import { translate, ui } from 'angular';
import { module } from 'angular';

import { Template } from '../Template';

import { DevelopersController } from './list.ctrl';
import { DevelopersService } from '../../data/DevelopersService';

import { ContractsStateParams, ContractsController } from './contracts/list.ctrl';
import { ContractsService } from '../../data/ContractsService';

module('opvo.developers', [])
	.controller('developersController', DevelopersController)
	.controller('contractsController', ContractsController)
	.service('developersService', DevelopersService)
	.service('contractsService', ContractsService)
	.config(($translatePartialLoaderProvider: translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('developers');
		$translatePartialLoaderProvider.addPart('contracts');
	})
	.config((
		$stateProvider: ui.IStateProvider,
		$urlRouterProvider: ui.IUrlRouterProvider
	) => {
		'ngInject';

		$urlRouterProvider.otherwise('/developers');

		$stateProvider
			.state('developers', {
				url: '/developers',
				templateUrl: Template.getUrl('developers/list'),
				controller: 'developersController',
				controllerAs: 'ctrl'
			})
			.state('developers.contracts', {
				url: '/contracts',
				params: new ContractsStateParams(),
				views: {
					'@': {
						templateUrl: Template.getUrl('developers/contracts/list'),
						controller: 'contractsController',
						controllerAs: 'ctrl'
					}
				}
			});
	});
