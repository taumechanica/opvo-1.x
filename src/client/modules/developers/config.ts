import '../../assets/styles/developers.less';
import '../../assets/styles/contracts.less';

import { translate } from 'angular';
import { module } from 'angular';
import { StateParams, StateProvider, UrlRouterProvider } from '@uirouter/angularjs';

import { Template } from '../Template';

import { DevelopersListController } from './DevelopersListController';
import { DevelopersService } from '../../data/DevelopersService';

import { ContractsListController } from './contracts/ContractsListController';
import { ContractDeleteController } from './contracts/ContractDeleteController';
import { ContractsService } from '../../data/ContractsService';

module('opvo.developers', [])
    .controller('developersListController', DevelopersListController)
    .controller('contractsListController', ContractsListController)
    .controller('contractDeleteController', ContractDeleteController)
    .service('developersService', DevelopersService)
    .service('contractsService', ContractsService)
    .config(($translatePartialLoaderProvider: translate.ITranslatePartialLoaderProvider) => {
        'ngInject';

        $translatePartialLoaderProvider.addPart('developers');
        $translatePartialLoaderProvider.addPart('contracts');
    })
    .config((
        $stateProvider: StateProvider,
        $urlRouterProvider: UrlRouterProvider
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
                url: '/:developerId/contracts',
                resolve: {
                    developer: async ($stateParams: StateParams, developersService: DevelopersService) => {
                        'ngInject';

                        try {
                            return await developersService.getById($stateParams.developerId);
                        } catch (ex) {
                            return null;
                        }
                    }
                },
                views: {
                    '@': {
                        templateUrl: Template.getUrl('developers/contracts/ContractsList'),
                        controller: 'contractsListController',
                        controllerAs: 'ctrl'
                    }
                }
            });
    });
