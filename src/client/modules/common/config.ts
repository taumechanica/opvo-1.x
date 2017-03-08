import '../../assets/styles/common.less';

import { translate } from 'angular';
import { module } from 'angular';

import { InputDateDirectiveFactory } from './InputDateDirective';
import { LoadingDirectiveFactory } from './LoadingDirective';

module('opvo.common', [])
	.directive('inputDate', InputDateDirectiveFactory)
	.directive('loading', LoadingDirectiveFactory)
	.config(($translatePartialLoaderProvider: translate.ITranslatePartialLoaderProvider) => {
		'ngInject';

		$translatePartialLoaderProvider.addPart('common');
	});
