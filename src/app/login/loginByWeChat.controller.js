(function () {
    'use strict';

    angular
        .module('vk')
        .controller('LoginByWeChatController', LoginByWeChatController);

    /** @ngInject */
    LoginByWeChatController.$inject = ['$location', 'LoginService', 'SessionStorageService', '$sessionStorage', 'weChatHost'];

    function LoginByWeChatController($location, LoginService, SessionStorageService, $sessionStorage, weChatHost) {
        var storeId = $location.search().storeId || $sessionStorage.storeId;
        if (!storeId) {
            $location.url('/noStoreId');
            return;
        }
        SessionStorageService.setOneSessionStorage("storeId", storeId);

        // navigator.geolocation.getCurrentPosition(function (position) {
        //     console.log("获取地理位置成功");
        //     SessionStorageService.setOneSessionStorage("latitude", position.coords.latitude);
        //     SessionStorageService.setOneSessionStorage("longitude", position.coords.longitude);
        // }, function (fail) {
        //     alert("获取地理位置失败");
        // });


        var redirectUrl = encodeURIComponent(weChatHost + "/getUserInfo");

        LoginService.loginByWeChat(storeId, redirectUrl).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                console.log(data.message);
            }
            console.log("loginByWeChat", data);
            SessionStorageService.setOneSessionStorage("appId", data.appId);// 微信公共号
            SessionStorageService.setOneSessionStorage("parentId", data.parentId);// 微信公共号

            window.location.href = data.oauth_url;

        }, function (e) {

        })

    }
})();
