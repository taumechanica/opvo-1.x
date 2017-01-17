import * as ng from 'angular';

import './application.pug';
import './assets/styles/application.less';

import './modules/developers/config';

ng.module('opvo', [
	'ui.router',
	'opvo.developers'
]);
