/**
 * Created by wenpeng.guo on 11/10/16.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$http', '$q', 'restUrl','restUrlV2','appUrl','restUrlV3','restUrlV6'];

    function LoginService($http, $q, restUrl,restUrlV2,appUrl,restUrlV3,restUrlV6) {
        return {
            loginByWeChat: loginByWeChat,
            getOpenId: getOpenId,
            getTokenByOpenId: getTokenByOpenId,
            getMemberInfo: getMemberInfo,
            loginByVKApi: loginByVKApi,
            switchAccount: switchAccount,
            logout: logout,
            loginHeyteaByVKApi:loginHeyteaByVKApi,
            getVcode:getVcode,
            loginmaiByVKApi:loginmaiByVKApi,
            checkmobileByCard:checkmobileByCard,
            getStoreExplainRemark:getStoreExplainRemark,
            getStoreConfig:getStoreConfig
        };

        function switchAccount(cardId, token, openId) {
            return $http({
                method: 'POST',
                url: restUrl + 'card/activateToken',
                headers: {
                    cardId: cardId,
                    token: token
                },
                data: {
                    id: cardId,
                    openId: openId
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function logout() {

        }
        function getVcode(storeId, param) {
            return $http({
                method: 'GET',
                url: appUrl + 'sms_pasword/by/' + param.otherMobile,
                dataType: "json",
                headers: {
                    storeId: storeId
                }
            }).then(completed).catch(failed);
        }

        function getStoreExplainRemark(storeId) {
            return $http({
                method: 'GET',
                url: restUrl + 'getStoreExplainRemark/' +storeId,
                dataType: "json",

            }).then(completed).catch(failed);
        }
        function getStoreConfig(storeId) {
           return $http({
               method: 'GET',
               url: restUrlV6 + 'store_config/' +storeId,
               dataType: "json",

    }).then(completed).catch(failed);
}
        function loginByWeChat(storeId, redirectUrl) {
            return $http({
                method: 'GET',
                url: restUrl + 'weixin/codeByOnlyOpenId/' + redirectUrl + '/' + storeId,
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function getOpenId(code, appId, storeId) {
            return $http({
                method: 'GET',
                url: restUrl + 'weixin/weixin_user/' + appId + '/' + code + '/' + storeId,
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function getTokenByOpenId(openId, storeId) {
            return $http({
                method: 'GET',
                url: restUrl + 'openId/getToken/' + storeId + '/' + openId,
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function getMemberInfo(openId, storeId) {
            return $http({
                method: 'GET',
                url: restUrl + 'card/getByOpenId/' + openId + '/' + storeId,
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function loginByVKApi(storeId, params) {
            return $http({
                method: 'POST',
                url: restUrl + 'card/activateToken',
                data: {
                    storeId: storeId,
                    mobile: params.mobile,
                    password: params.password,
                    openId: params.openId
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function loginHeyteaByVKApi(storeId, params) {
            return $http({
                method: 'POST',
                url: restUrlV2 + 'card/activateToken',
                data: {
                    storeId: storeId,
                    mobile: params.mobile,
                    password: params.password,
                    openId: params.openId
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function loginmaiByVKApi(storeId, params) {
            return $http({
                method: 'POST',
                url: restUrlV3 + 'card/activateToken',
                data: {
                    storeId: storeId,
                    mobile: params.mobile,
                    password: params.password,
                    openId: params.openId,
                    otherMobile:params.othermobie,
                    mobileCode:params.mobilecode
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }
        function checkmobileByCard(storeId, params) {
            return $http({
                method: 'POST',
                url: restUrlV3 + 'card/checkCard',
                data: {
                    storeId: storeId,
                    mobile: params.mobile,
                    openId: params.openId
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }
        function loginHeyteaByWeChat(storeId, redirectUrl) {
            return $http({
                method: 'GET',
                url: restUrlV2 + 'weixin/codeByOnlyOpenId/' + redirectUrl + '/' + storeId,
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
