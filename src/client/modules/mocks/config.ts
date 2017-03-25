import { module } from 'angular';
import { IHttpBackendService, IFormController, INgModelController } from 'angular';

export default module('opvo.mocks', [])
	.run(($httpBackend: IHttpBackendService) => {
		'ngInject';

		$httpBackend.whenGET(/^\/i18n\/.*?\/\w{2}\.json$/).respond({ });
		$httpBackend.whenGET(/^\/rest\/settings$/).respond({ });
	});

export class Deferred<T> {
	public resolve: (value?: T | PromiseLike<T>) => void;
	public reject: (value?: T | PromiseLike<T>) => void;

	public promise: Promise<T>;

	public constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}

export class FormController implements IFormController {
	public $pristine: boolean;
	public $dirty: boolean;
	public $valid: boolean;
	public $invalid: boolean;
	public $submitted: boolean;
	public $error: any;
	public $name: string;
	public $pending: any;

	public constructor() {
		this.$valid = true;
		this.$invalid = false;
	}

	public $addControl(control: INgModelController | IFormController) { }
	public $removeControl(control: INgModelController | IFormController) { }

	public $setValidity(
		validationErrorKey: string,
		isValid: boolean,
		control: INgModelController | IFormController
	) {
		this.$valid = isValid;
		this.$invalid = !isValid;
	}

	public $setDirty() { }
	public $setPristine() { }
	public $commitViewValue() { }
	public $rollbackViewValue() { }
	public $setSubmitted() { }
	public $setUntouched() { }
}
