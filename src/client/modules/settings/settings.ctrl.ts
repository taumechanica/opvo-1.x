import { translate } from 'angular';
import { IFormController, INgModelController, IScope } from 'angular';

import { Settings } from '../../domain/Settings';
import { SettingsService } from '../../data/SettingsService';

export class SettingsController {
	public loading: boolean;

	public settingsForm: IFormController;
	public settingsModel: Settings;

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
			const { settingsModel } = this;

			await this.settingsService.set(settingsModel);
			this.$translate.use(settingsModel.Language);
		} finally {
			this.loading = false;
			this.$scope.$apply();
		}
	}

	public selectRange(target: INgModelController) {
		const { settingsForm, settingsModel } = this;
		settingsForm.$setSubmitted();

		const { YearFrom, YearTo } = settingsModel;
		target.$setValidity('range', YearFrom <= YearTo);

		const oppositeName = target.$name === 'from' ? 'to' : 'from';
		const opposite: INgModelController = settingsForm[oppositeName];
		opposite.$setValidity('range', true);

		if (settingsForm.$invalid) return;

		this.settingsService.set(settingsModel);
	}

	private async loadData() {
		this.loading = true;

		try {
			this.settingsModel = await this.settingsService.get();
		} finally {
			this.loading = false;
			this.$scope.$apply();
		}
	}
}
