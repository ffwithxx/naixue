(function () {
    'use strict';

    angular
        .module('vk')
        .controller('getUserInfoController', getUserInfoController);

    /** @ngInject */
    getUserInfoController.$inject = ['$location', 'LoginService', 'SessionStorageService', '$sessionStorage', 'lodash'];

    function getUserInfoController($location, LoginService, SessionStorageService, $sessionStorage, lodash) {
        var data = $location.search();
        //code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
        SessionStorageService.setOneSessionStorage("code", data.code);
        var code = $sessionStorage.code;
        var appId = $sessionStorage.appId;
        var storeId = $sessionStorage.storeId;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;

        if (!code) {
            if (!$sessionStorage.weChatOpenId) {
                alert("加载失败，请退出页面后重试！");
                return
            }

            //自动跳转回充值页面
            var url = $sessionStorage.redirectUrl;
            if (url != "/my_recharge" && url != "/myPayCode" && url != "/shopping" && url != "/pointShop"&&url != "/register") {
                url = "";
            }
            if (url) {
                $location.url(url + '?storeId=' + storeId+ "&theme=" + theme);
            } else {
                $location.url('/my?storeId=' + storeId+ "&theme=" + theme);
            }
        }else {

            LoginService.getOpenId(code, appId, storeId).then(function (retDate) {
                console.log("getOpenId", retDate);
                if (retDate.code != 200 && !$sessionStorage.weChatOpenId) {
                    alert(retDate.message);
                    console.log(retDate.message);
                    return
                }
                SessionStorageService.setOneSessionStorage("weChatOpenId", retDate.openId);


                var card = lodash.find(retDate.data, function (eachMemberInfo) {
                    return storeId == eachMemberInfo.card.storeId
                });

                if (!card) {
                    console.log('您没有该门店的会员卡,请重新登录或注册');
                    // alert("您没有该门店的会员卡,请重新登录或注册");
                    $location.url('/loginByVKApi?storeId=' + storeId + "&theme=" + theme);
                    return
                }

                SessionStorageService.setOneSessionStorage("token", card.token);
                SessionStorageService.setOneSessionStorage("ticketsCount", card.ticketsCount);
                SessionStorageService.setAllSessionStorage(card.card, function (res) {
                    $sessionStorage.memberName = $sessionStorage.name;
                    $sessionStorage.cardId = $sessionStorage.id;
                });

                //自动跳转回充值页面
                var url = $sessionStorage.redirectUrl;
                if (url != "/my_recharge" && url != "/myPayCode" && url != "/shopping" && url != "/pointShop" && url != "/register") {
                    url = "";
                }
                if (url) {
                    $location.url(url + '?storeId=' + storeId + "&theme=" + theme);
                } else {
                    $location.url('/my?storeId=' + storeId + "&theme=" + theme);
                }


            }, function (e) {
            });

        }
    }
})();
