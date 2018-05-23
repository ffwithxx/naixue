/**
 * Created by ganyang on 16/11/11.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .factory('ForgetPwdService', ForgetPwdService);

    ForgetPwdService.$inject = ['$http', '$q', 'appUrl', 'restUrl'];

    function ForgetPwdService($http, $q, appUrl, restUrl) {
        return {
            getVcode: getVcode,
            resetPwd: resetPwd,
            getMyCards: getMyCards
        };

        function getMyCards(storeId, mobile) {
            return $http({
                method: 'GET',
                url: appUrl + 'vip/by/mobile/storeId/' + mobile + '/' + storeId
            }).then(completed).catch(failed);
        }

        function getVcode(storeId, param,csessionid,sig,tokenStr,scene) {
            return $http({
                method: 'GET',
                url: appUrl + 'sms_pasword/by/' + param.mobile,
                dataType: "json",
                headers: {
                    storeId: storeId,
                    csessionid:csessionid,
                    sig:sig,
                    token:tokenStr,
                    scene:scene
                }
            }).then(completed).catch(failed);
        }

        function resetPwd(storeId, params) {
            return $http({
                method: 'PUT',
                url: restUrl + 'card/reset/passWord',
                data: {
                    storeId: storeId,
                    mobile: params.mobile,
                    mobileCode: params.vcode,
                    password: params.pwd,
                    id: params.cardId
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function completed(response) {
            return response.data;
        }

        function failed(e) {
            return $q.reject(e);
        }
    }
})();
