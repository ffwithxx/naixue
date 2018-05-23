/* global moment:false _:false */
(function () {
    'use strict';

    window.isDebug = false

    window.isTest = true
    var host = window.isTest ? 'vi-ni.com' : 'v-ka.com';
    if(window.isDebug) {
      host = 'vi-ni.com';
    }

    var baseURL = 'https://api.' + host
    var uploadURL = 'https://admin.' + host

    // var baseURL = 'https://api.v-ka.com';
    angular
        .module('vk')
        .constant('moment', moment)
        .constant('lodash', _)
        .constant('JsBarcode', JsBarcode)

        // .constant('appUrl', 'http://192.168.31.96:8089/app/')
        // .constant('restUrl', 'http://192.168.31.96:8089/rest/')
        // .constant('restUrlV2', 'http://192.168.31.96:8089/rest2/');
        // .constant('appUrl', 'http://192.168.1.104/app/')
        // .constant('restUrl', 'http://192.168.1.104/rest/')
        // .constant('restUrlV2', 'http://192.168.1.104/rest2/');
        .constant('weChatHost', baseURL + '/membershipnaixue')
        .constant('appUrl', baseURL + '/app/v1/')
        .constant('webApiUrl', baseURL + '/webapi/')
        .constant('restUrl', baseURL + '/webapi/v1/')
        .constant('restUrlV2', baseURL + '/webapi/v2/')
        .constant('restUrlV3', baseURL + '/webapi/v3/')
        .constant('restUrlV4', baseURL + '/webapi/v4_0/')
        .constant('restUrlV5', baseURL + '/webapi/v4/')
        .constant('restUrlV6', baseURL + '/webapi/v4_1/')
        .constant('levelV1', baseURL + '/webapi/level/v1/')
        .constant('pointV1', baseURL + '/webapi/point/v1/')
        .constant('uploadUrl', baseURL + '/api');

        // .constant('weChatHost', 'https://api.v-ka.com/membershipnaixue')
        // .constant('appUrl', 'https://api.v-ka.com/app/v1/')
        // .constant('restUrl', 'https://api.v-ka.com/webapi/v1/')
        // .constant('restUrlV2', 'https://api.v-ka.com/webapi/v2/')
        // .constant('restUrlV3', 'https://api.v-ka.com/webapi/v3/');

})();
