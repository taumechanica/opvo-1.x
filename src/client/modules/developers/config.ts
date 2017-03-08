import '../../assets/styles/developers.less';
import '../../assets/styles/contracts.less';

import { translate, ui } from 'angular';
import { module } from 'angular';

import { Template } from '../Template';

import { DevelopersListController } from './DevelopersListController';
import { DevelopersService } from '../../data/DevelopersService';

import { ContractsStateParams, ContractsListController } from './contracts/ContractsListController';
import { ContractsService } from '../../data/ContractsService';

module('opvo.developers', [])
	.controller('developersListController', DevelopersListController)
	.controller('contractsListController', ContractsListController)
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
				templateUrl: Template.getUrl('developers/DevelopersList'),
				controller: 'developersListController',
				controllerAs: 'ctrl'
			})
			.state('developers.contracts', {
				url: '/contracts',
				params: new ContractsStateParams(),
				views: {
					'@': {
						templateUrl: Template.getUrl('developers/contracts/ContractsList'),
						controller: 'contractsListController',
						controllerAs: 'ctrl'
					}
				}
			});
	});
