(function () {
    'use strict';

    angular
        .module('vk')
        .controller('LoginByWeChatHeyTeaController', LoginByWeChatHeyTeaController);

    /** @ngInject */
    LoginByWeChatHeyTeaController.$inject = ['$location', 'LoginService', 'SessionStorageService', '$sessionStorage', 'weChatHost'];

    function LoginByWeChatHeyTeaController($location, LoginService, SessionStorageService, $sessionStorage, weChatHost) {
        document.title = "奈雪の茶";
        var storeId = $location.search().storeId || $sessionStorage.storeId;
        if (!storeId) {
                $location.url('/noStoreId');
                // window.alert('没有门店ID: ' + $location.absUrl())
                return;
        }
        SessionStorageService.setOneSessionStorage("storeId", storeId);

        var redirectUrl = encodeURIComponent(weChatHost + "/heytea-getUserInfo");

        LoginService.loginByWeChat(storeId, redirectUrl).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                console.log(data.message);
            }


            // if(!data.data.otherMobile){
            //
            //     $location.url('/loginByVKApiHeyTea?storeId=' + storeId+'&theme=heytea');
            // }
            console.log("loginByWeChatHeyTea", data);
            SessionStorageService.setOneSessionStorage("appId", data.appId);// 微信公共号
            SessionStorageService.setOneSessionStorage("parentId", data.parentId);// 微信公共号

            window.location.href = data.oauth_url;

        }, function (e) {

        })

    }
})();
