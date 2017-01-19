import * as ng from 'angular';

import './application.pug';
import './assets/styles/application.less';

import './modules/developers/config';

const getSvgSpriteUrl = (id: string) => {
	require(`./assets/images/svg-sprite-${id}.svg`);
	return `/img/svg-sprite-${id}.svg`;
};

ng
	.module('opvo', [
		'ngMaterial',
		'ui.router',
		'opvo.developers'
	])
	.config(($mdIconProvider: ng.material.IIconProvider) => {
		'ngInject';

		$mdIconProvider.iconSet('content', getSvgSpriteUrl('content'));
	});
