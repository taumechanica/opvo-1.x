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
		'ngMessages',
		'ngSanitize',
		'pascalprecht.translate',
		'ui.router',
		'opvo.developers'
	])
	.config(($mdIconProvider: ng.material.IIconProvider) => {
		'ngInject';

		$mdIconProvider.iconSet('content', getSvgSpriteUrl('content'));
		$mdIconProvider.iconSet('navigation', getSvgSpriteUrl('navigation'));
	})
	.config(($translateProvider: ng.translate.ITranslateProvider) => {
		'ngInject';

		$translateProvider.translations('en', {
			DEVELOPERS_LIST: 'Developers',
			DEVELOPERS_ADD: 'Add record',
			DEVELOPERS_NEW: 'New record',
			DEVELOPERS_NAME: 'Name',
			DEVELOPERS_AMOUNT: 'The ceiling amount of liability, million rubles',
			DEVELOPERS_NAME_TOO_LONG: 'The name is too long',
			DEVELOPERS_NAME_TOO_SHORT: 'The name is too short',
			DEVELOPERS_NAME_REQUIRED: 'Type the name',
			DEVELOPERS_AMOUNT_PATTERN: 'Type the number from 1 to 99',
			DEVELOPERS_AMOUNT_REQUIRED: 'Type the amount',

			CANCEL: 'Cancel',
			CLOSE: 'Close',
			SAVE: 'Save'
		});

		$translateProvider.translations('ru', {
			DEVELOPERS_LIST: 'Исполнители',
			DEVELOPERS_ADD: 'Добавить запись',
			DEVELOPERS_NEW: 'Новая запись',
			DEVELOPERS_NAME: 'Название',
			DEVELOPERS_AMOUNT: 'Предельная сумма ответственности, млн. руб.',
			DEVELOPERS_NAME_TOO_LONG: 'Название слишком длинное',
			DEVELOPERS_NAME_TOO_SHORT: 'Название слишком короткое',
			DEVELOPERS_NAME_REQUIRED: 'Введите название',
			DEVELOPERS_AMOUNT_PATTERN: 'Введите число от 1 до 99',
			DEVELOPERS_AMOUNT_REQUIRED: 'Введите сумму',

			CANCEL: 'Отмена',
			CLOSE: 'Закрыть',
			SAVE: 'Сохранить'
		});

		$translateProvider.preferredLanguage('ru');
		$translateProvider.useSanitizeValueStrategy('sanitizeParameters');
	});
