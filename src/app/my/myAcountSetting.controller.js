(function () {
    'use strict';

    angular
        .module('vk')
        .controller('myAcountSettingController', myAcountSettingController);

    /** @ngInject */
    myAcountSettingController.$inject = ['$location', 'SessionStorageService', '$sessionStorage', 'MyService', 'lodash', 'LoginService'];

    function myAcountSettingController($location, SessionStorageService, $sessionStorage, MyService, lodash, LoginService) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var message = $location.search().message;
        var storeId = $sessionStorage.storeId;
        var mobile = $sessionStorage.mobile;
        var openId = $sessionStorage.weChatOpenId;
        // var openId = $sessionStorage.openId;
        var cardToLogin;

        var vm = this;
        vm.currentCardId = cardId;
        vm.loginByWeChat = loginByWeChat;
        vm.addNewCard = addNewCard;
        vm.deleteCard = deleteCard;
        vm.popUpDialog = popUpDialog;
        vm.onCardClick = onCardClick;
        vm.closeDialog = closeDialog;
        vm.goBack = goBack;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;

        if (message) {
            alert(message);
        }



        MyService.getMyCards(storeId, openId).then(function (data) {
            if (data.code != 200) {
                console.log(data.message);
                alert(data.message);
                return
            }
            if (lodash.isEmpty(data.data)) {
                alert("没有会员卡")
            }
            vm.myCards = data.data;
        });


        function popUpDialog() {
            vm.account = "";
            vm.accountPwd = "";
            vm.actionType = "addCard";
            vm.showDialog = true;
        }
        function formatDateTime(inputTime) {


            var date = new Date(inputTime);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        };
        function addNewCard(action) {
            if (!vm.account || !vm.accountPwd) {
                return
            }

            if (action === "addCard") {
                var pa = {mobile: vm.account, password: vm.accountPwd, openId: openId};
                LoginService.loginByVKApi(storeId, pa).then(function (data) {
                    if (data.code != 200) {
                        // vm.showDialog = false;
                        if (data.code == 1351 || data.code == 1356) {
                            SessionStorageService.setOneSessionStorage("dengLuID", vm.account);
                            SessionStorageService.setOneSessionStorage("pwd", vm.accountPwd);
                            $location.url('/activation?storeId=' + storeId+"&type="+"myAcountSetting"+ "&theme=" + theme);
                            return

                        }
                        alert(data.message);
                        console.log(data.message);
                        return
                    }
                    vm.showDialog = false;

                    SessionStorageService.setOneSessionStorage("token", data.token);
                    SessionStorageService.setOneSessionStorage("cardId", data.data.id);
                    SessionStorageService.setOneSessionStorage("ticketsCount", data.ticketsCount);
                    SessionStorageService.setOneSessionStorage("payCode", "");
                    var timestamp = formatDateTime(data.data.activated);
                    SessionStorageService.setOneSessionStorage("activated", timestamp);
                    SessionStorageService.setAllSessionStorage(data.data, function (res) {
                        $sessionStorage.memberName = $sessionStorage.name;
                        $sessionStorage.activated = timestamp;
                    });
                    vm.currentCardId = data.data.id;
                    getcards();
                    // vm.myCards.push({card: data.data, ticketsCount: data.data.ticketsCount, token: data.token});



                }, function (e) {
                })
            } else if (action === "login") {
                if (!vm.account || !vm.accountPwd) {
                    return
                }
                vm.showDialog = false;
                $location.url("/loginByVKApi?storeId=" + storeId
                    + "&mobile=" + vm.account
                    + "&pwd=" + vm.accountPwd
                    + "&redirect=/myAcountSetting"+ "&theme=" + theme);
            }
        }


        function deleteCard(unbindCardId) {
            console.log(unbindCardId);
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.deleteCard(cardId, token, {unbindCardId:unbindCardId}).then(function (data) {
                if (data.code != 200) {
                    console.log(data.message);
                    alert(data.message);
                    return
                }
                vm.myCards = lodash.filter(vm.myCards, function (each) {
                    return each.card.id != unbindCardId
                });
            });


            vm.showDeleteDialog = 0;
        }

function getcards() {
    MyService.getMyCards(storeId, openId).then(function (data) {
        if (data.code != 200) {
            console.log(data.message);
            alert(data.message);
            return
        }
        if (lodash.isEmpty(data.data)) {
            alert("没有会员卡")
        }
        vm.myCards = data.data;
    });
}
        function onCardClick(item) {
            LoginService.switchAccount(item.card.id, item.token, openId).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    // vm.msg.warning = true;
                    // vm.msg.message = data.message;
                    // $timeout(function () {
                    //     vm.msg.warning = false;
                    //     vm.msg.message = '';
                    // }, 2000);
                    return;
                }
                // //置空payCode, 返回我的页面重新获取
                SessionStorageService.setOneSessionStorage("token", item.token);
                SessionStorageService.setOneSessionStorage("cardId", item.card.id);
                SessionStorageService.setOneSessionStorage("ticketsCount", item.ticketsCount);
                SessionStorageService.setOneSessionStorage("payCode", "");
                SessionStorageService.setAllSessionStorage(data.data, function (res) {
                    $sessionStorage.memberName = $sessionStorage.name;
                });

                $location.url('/my?storeId=' + storeId+ "&theme=" + theme);

            }, function (e) {
                // vm.
            });


        }


        function goBack() {
            $location.url("/my?storeId=" + storeId+ "&theme=" + theme);
        }

        function loginByWeChat() {
            $location.url("/loginByWeChat?storeId=" + storeId+ "&theme=" + theme);
        }

        function closeDialog() {
            vm.account = "";
            vm.accountPwd = "";
            vm.showDialog = false;
        }


    }
})();
