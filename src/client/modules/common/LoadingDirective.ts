import { isUndefined } from 'angular';
import { IScope } from 'angular';

import { Template } from '../Template';

export function LoadingDirectiveFactory() {
    return {
        restrict: 'E',
        templateUrl: Template.getUrl('common/Loading'),

        scope: {
            when: '=',
            diameter: '@?'
        },

        link: (scope: IScope, element: JQuery) => {
            element.addClass('hidden');
            element.parent().addClass('relative');

            if (isUndefined(scope['diameter'])) {
                scope['diameter'] = '50';
            }

            scope.$watch('when', (value: boolean) => {
                if (value) {
                    element.removeClass('hidden');
                } else {
                    element.addClass('hidden');
                }
            });
        }
    };
}
