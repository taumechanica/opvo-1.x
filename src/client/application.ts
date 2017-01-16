import * as ng from 'angular';

import './application.pug';
import './assets/styles/default.less';

import './modules/developers/config';

ng.module('opvo', [
	'ui.router',
	'opvo.developers'
]);
