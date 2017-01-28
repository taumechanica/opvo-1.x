import '../../assets/styles/common.less';

import * as ng from 'angular';

import { LoadingDirectiveFactory } from './loading.dir';

ng
	.module('opvo.common', [])
	.directive('loading', LoadingDirectiveFactory)
	.config(($translatePartialLoaderProvider: ng.translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('common');
	});
