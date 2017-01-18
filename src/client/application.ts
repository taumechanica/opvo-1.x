import * as ng from 'angular';

import './application.pug';
import './assets/styles/application.less';

import './modules/developers/config';

ng.module('opvo', [
	'ngMaterial',
	'ui.router',
	'opvo.developers'
]);
