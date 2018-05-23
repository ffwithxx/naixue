(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaGetUserInfoController', HeyTeaGetUserInfoController);

    /** @ngInject */
    HeyTeaGetUserInfoController.$inject = ['$location', 'LoginService', 'SessionStorageService', '$sessionStorage', 'lodash'];

    function HeyTeaGetUserInfoController($location, LoginService, SessionStorageService, $sessionStorage, lodash) {
        document.title = "奈雪の茶";
        var data = $location.search();
        //code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
        SessionStorageService.setOneSessionStorage("code", data.code);
        var code = $sessionStorage.code;
        var appId = $sessionStorage.appId;
        var storeId = $sessionStorage.storeId;
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
                $location.url('/loginByVKApiHeyTea?storeId=' + storeId);
                return
            }
            if(!card.card.otherMobile){

                $location.url('/loginByVKApiHeyTea?storeId=' + storeId+'&theme=heytea');
                return
            }

            // var params = {mobile: card.card.mobile, password: pwd, openId: retDate.openId};
            // LoginService.loginHeyteaByVKApi(storeId, params).then(function (data) {
            //
            // }, function (e) {
            //     // vm.msg.warning = true;
            //     // vm.msg.message = '账号/密码输入错误';
            //     // $timeout(function () {
            //     //     vm.msg.warning = false;
            //     //     vm.msg.message = '';
            //     // }, 2000);
            // });
            // alert(JSON.stringify(card));

            SessionStorageService.setOneSessionStorage("token", card.token);
            SessionStorageService.setOneSessionStorage("ticketsCount", card.ticketsCount);
            SessionStorageService.setAllSessionStorage(card.card, function (res) {
                $sessionStorage.memberName = $sessionStorage.name;
                $sessionStorage.cardId = $sessionStorage.id;
            });

            //自动跳转回充值页面
            var url = $sessionStorage.redirectUrl;
            if (url != "/heytea-myPayCode" && url != "/heytea-pointShop") {
                url = "";
            }
            if (url) {
                $location.url(url + '?storeId=' + storeId);
            } else {
                $sessionStorage.showSplash = true;
                $sessionStorage.showagreeMent = true;
                $location.url('/heytea-my?storeId=' + storeId);
            }

        }, function (e) {
        });


    }
})();
