(function () {
    'use strict';

    angular
        .module('vk')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $animate) {
        $animate.enabled(true);
        $log.debug('runBlock end');
        //fastclick
        // FastClick.attach(document.body);
    }

})();
