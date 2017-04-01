import { extend, module } from 'angular';
import { IHttpBackendService } from 'angular';

export default module('opvo.mocks', [])
	.run(($httpBackend: IHttpBackendService) => {
		'ngInject';

		$httpBackend.whenGET(/^\/i18n\/.*?\/\w{2}\.json$/).respond({ });
		$httpBackend.whenGET(/^\/rest\/settings$/).respond({ });
	});

export const Factory = <T>(properties?: any) => <T>extend({ }, properties);

export class Deferred<T> {
	public resolve: (value?: T | PromiseLike<T>) => void;
	public reject: (value?: T | PromiseLike<T>) => void;

	public promise: Promise<T>;

	public constructor() {
		this.reset();
	}

	public reset() {
		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}
