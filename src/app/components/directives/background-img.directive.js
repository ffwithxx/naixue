/**
 * Created by wenpeng.guo on 3/14/17.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .directive('vkBackImg', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.$watch(function () {
                        return attrs.vkBackImg
                    }, function (v) {
                        if (v != "") {
                            element.css({
                                'background-image': 'url(' + v + ')'
                            });
                        }
                    });
                }
            };
        });
})();
