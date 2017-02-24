import { translate } from 'angular';
import { IScope } from 'angular';

import { Settings } from '../../domain/Settings';
import { SettingsService } from '../../data/SettingsService';

export class SettingsController {
	public loading: boolean;

	public settings: Settings;

	constructor(
		private $scope: IScope,
		private $translate: translate.ITranslateProvider,
		private settingsService: SettingsService
	) {
		'ngInject';

		this.loadData();
	}

	public async selectLanguage() {
		this.loading = true;

		try {
			const { settings } = this;

			await this.settingsService.set(settings);
			this.$translate.use(settings.Language);
		} finally {
			this.loading = false;
			this.$scope.$apply();
		}
	}

	private async loadData() {
		this.loading = true;

		try {
			this.settings = await this.settingsService.get();
		} finally {
			this.loading = false;
			this.$scope.$apply();
		}
	}
}
