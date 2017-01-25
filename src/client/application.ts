import * as ng from 'angular';

import './application.pug';
import './assets/styles/application.less';

import './modules/common/config';
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
		'opvo.common',
		'opvo.developers'
	])
	.config(($mdIconProvider: ng.material.IIconProvider) => {
		'ngInject';

		$mdIconProvider.iconSet('action', getSvgSpriteUrl('action'));
		$mdIconProvider.iconSet('content', getSvgSpriteUrl('content'));
		$mdIconProvider.iconSet('navigation', getSvgSpriteUrl('navigation'));
	})
	.config(($translateProvider: ng.translate.ITranslateProvider) => {
		'ngInject';

		$translateProvider.translations('en', {
			ADD_RECORD: 'Add record',
			NEW_RECORD: 'New record',
			EDIT_RECORD: 'Edit record',
			DELETE_RECORD: 'Delete record',
			COULD_NOT_SAVE: 'Could not save record',
			COULD_NOT_DELETE: 'Could not delete record',
			CONFIRM_DELETE: 'Would you like to delete the record #{{ id }}?',

			DEVELOPERS_LIST: 'Developers',
			DEVELOPERS_NAME: 'Name',
			DEVELOPERS_AMOUNT: 'The ceiling amount of liability, million rubles',
			DEVELOPERS_NAME_TOO_LONG: 'The name is too long',
			DEVELOPERS_NAME_TOO_SHORT: 'The name is too short',
			DEVELOPERS_NAME_REQUIRED: 'Type the name',
			DEVELOPERS_AMOUNT_PATTERN: 'Type the number from 1 to 99',
			DEVELOPERS_AMOUNT_REQUIRED: 'Type the amount',
			DEVELOPERS_DELETE_NOTE: 'All of the contracts will also be deleted',

			CANCEL: 'Cancel',
			CLOSE: 'Close',
			SAVE: 'Save',
			EDIT: 'Edit',
			DELETE: 'Delete',
			YES: 'Yes'
		});

		$translateProvider.translations('ru', {
			ADD_RECORD: 'Добавить запись',
			NEW_RECORD: 'Новая запись',
			EDIT_RECORD: 'Редактировать запись',
			DELETE_RECORD: 'Удалить запись',
			COULD_NOT_SAVE: 'Не удалось сохранить запись',
			COULD_NOT_DELETE: 'Не удалось удалить запись',
			CONFIRM_DELETE: 'Желаете удалить запись #{{ id }}?',

			DEVELOPERS_LIST: 'Исполнители',
			DEVELOPERS_NAME: 'Название',
			DEVELOPERS_AMOUNT: 'Предельная сумма ответственности, млн. руб.',
			DEVELOPERS_NAME_TOO_LONG: 'Название слишком длинное',
			DEVELOPERS_NAME_TOO_SHORT: 'Название слишком короткое',
			DEVELOPERS_NAME_REQUIRED: 'Введите название',
			DEVELOPERS_AMOUNT_PATTERN: 'Введите число от 1 до 99',
			DEVELOPERS_AMOUNT_REQUIRED: 'Введите сумму',
			DEVELOPERS_DELETE_NOTE: 'Вся информация о договорах также будет удалена',

			CANCEL: 'Отмена',
			CLOSE: 'Закрыть',
			SAVE: 'Сохранить',
			EDIT: 'Редактировать',
			DELETE: 'Удалить',
			YES: 'Да'
		});

		$translateProvider.preferredLanguage('ru');
		$translateProvider.useSanitizeValueStrategy('sanitizeParameters');
	});
