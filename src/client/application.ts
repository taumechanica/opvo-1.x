import { material, module, translate } from 'angular';

import './application.pug';

import './modules/common/config';
import './modules/contracts/config';
import './modules/developers/config';
import './modules/settings/config';

const getSvgSpriteUrl = (id: string) => {
	require(`./assets/images/svg-sprite-${id}.svg`);
	return `/img/svg-sprite-${id}.svg`;
};

module('opvo', [
	'ngMaterial',
	'ngMessages',
	'ngSanitize',
	'pascalprecht.translate',
	'ui.router',
	'opvo.common',
	'opvo.contracts',
	'opvo.developers',
	'opvo.settings'
])
	.config(($mdIconProvider: material.IIconProvider) => {
		'ngInject';

		$mdIconProvider.iconSet('action', getSvgSpriteUrl('action'));
		$mdIconProvider.iconSet('communication', getSvgSpriteUrl('communication'));
		$mdIconProvider.iconSet('content', getSvgSpriteUrl('content'));
		$mdIconProvider.iconSet('navigation', getSvgSpriteUrl('navigation'));
	})
	.config(($translateProvider: translate.ITranslateProvider) => {
		'ngInject';

		$translateProvider.useLoader('$translatePartialLoader', {
			urlTemplate: '/i18n/{part}/{lang}.json'
		});
		$translateProvider.preferredLanguage('ru');
		$translateProvider.useSanitizeValueStrategy('sanitizeParameters');
	});
