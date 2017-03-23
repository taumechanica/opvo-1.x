import { module } from 'angular';
import { IHttpBackendService } from 'angular';

export default module('opvo.mocks', [])
	.run(($httpBackend: IHttpBackendService) => {
		'ngInject';

		$httpBackend.whenGET(/^\/i18n\/.*?\/\w{2}\.json$/).respond({ });
		$httpBackend.whenGET(/^\/rest\/settings$/).respond({ });
	});
