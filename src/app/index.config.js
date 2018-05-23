(function () {
    'use strict';

    angular
        .module('vk')
        .config(config);

    /** @ngInject */
    function config($logProvider, baiduMapApiProvider) {
        // Enable log
        $logProvider.debugEnabled(true);
        baiduMapApiProvider.version('2.0').accessKey('BEGqAqQLbeHn6yucCyEDXHTOL3pqU1A0');

    }

//     新开了两个正常一点的卡号：
//     账号：98765432    密码：111111
//     账号：18254595538  密码：111111


})();
