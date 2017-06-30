import { auto, mock } from 'angular';
import { extend } from 'angular';
import { ICompileService, IScope } from 'angular';

import application from '../../application';
import mocks from '../mocks/config';

describe('LoadingDirective', () => {
    beforeEach(mock.module(application.name));
    beforeEach(mock.module(mocks.name));

    let $scope: IScope;
    let $compile: ICompileService;

    const model: { value?: boolean; } = { };

    beforeEach(inject(($injector: auto.IInjectorService) => {
        $scope = extend($injector.get('$rootScope').$new(), { model });
        $compile = $injector.get('$compile');
    }));

    const compile = (template?: string) => {
        template = template || '<div><loading when="model.value"></div>';
        const element = $compile(template)($scope);
        $scope.$digest();
        return element;
    };

    it('should set appropriate classes and default diameter value', () => {
        const container = compile();
        const loader = container.find('loading');
        const indicator = container.find('md-progress-circular');

        expect(container.hasClass('relative')).toBeTruthy();
        expect(loader.hasClass('hidden')).toBeTruthy();
        expect(indicator.attr('md-diameter')).toEqual('50');
    });

    it('should show/hide loader according to scope variable value', () => {
        const container = compile();
        const loader = container.find('loading');

        model.value = true;
        $scope.$digest();
        expect(loader.hasClass('hidden')).toBeFalsy();

        model.value = false;
        $scope.$digest();
        expect(loader.hasClass('hidden')).toBeTruthy();
    });

    it('should set diameter according to scope variable value', () => {
        const container = compile('<div><loading when="model.value" diameter="100"></div>');
        const indicator = container.find('md-progress-circular');

        expect(indicator.attr('md-diameter')).toEqual('100');
    });
});
