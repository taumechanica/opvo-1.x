import '../../assets/styles/common.less';

import * as ng from 'angular';

import { LoadingDirectiveFactory } from './loading.dir';

ng
	.module('opvo.common', [])
	.directive('loading', LoadingDirectiveFactory);
