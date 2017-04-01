import { auto, mock } from 'angular';
import { extend } from 'angular';
import { ICompileService, IScope } from 'angular';

import application from '../../application';
import mocks from '../mocks/config';

describe('InputDateDirective', () => {
	beforeEach(mock.module(application.name));
	beforeEach(mock.module(mocks.name));

	let $scope: IScope;
	let $compile: ICompileService;

	const model: { date?: Date; } = { };

	beforeEach(inject(($injector: auto.IInjectorService) => {
		$scope = extend($injector.get('$rootScope').$new(), { model });
		$compile = $injector.get('$compile');
	}));

	const compile = () => {
		const template = '<input ng-model="model.date" input-date>';
		const element = $compile(template)($scope);
		$scope.$digest();
		return element;
	};

	let element: JQuery;

	beforeEach(() => {
		element = compile();
	});

	describe('formatters', () => {
		it('it should leave the field blank when model is not a date', () => {
			model.date = undefined;
			$scope.$digest();
			expect(element.val()).toEqual('');

			model.date = null;
			$scope.$digest();
			expect(element.val()).toEqual('');
		});

		it('should fill the input field with a formatted model value', () => {
			model.date = new Date(2021, 3, 15, 12, 0, 0, 0);
			$scope.$digest();
			expect(element.val()).toEqual('15.04.2021');
		});
	});

	describe('parsers', () => {
		it('should return perfect date object when input good formatted value', () => {
			element.val('10.05.2020');
			element.triggerHandler('input');
			expect(model.date.getDate()).toEqual(10);
			expect(model.date.getMonth()).toEqual(4);
			expect(model.date.getFullYear()).toEqual(2020);
		});

		it('should return undefined when input bad formatted value', () => {
			element.val('bad.value');
			element.triggerHandler('input');
			expect(model.date).toBeUndefined();
		});

		it('should return null when value is empty', () => {
			element.val('');
			element.triggerHandler('input');
			expect(model.date).toBeNull();
		});
	});
});
