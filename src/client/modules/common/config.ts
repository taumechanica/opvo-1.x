import '../../assets/styles/common.less';

import { module, translate } from 'angular';

import { InputDateDirectiveFactory } from './inputDate.dir';
import { LoadingDirectiveFactory } from './loading.dir';

module('opvo.common', [])
	.directive('inputDate', InputDateDirectiveFactory)
	.directive('loading', LoadingDirectiveFactory)
	.config(($translatePartialLoaderProvider: translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('common');
	});
