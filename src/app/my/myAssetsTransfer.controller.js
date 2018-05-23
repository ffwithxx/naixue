(function () {
    'use strict';

    angular
        .module('vk')
        .controller('myAssetsTransferController', myAssetsTransferController);

    /** @ngInject */
    myAssetsTransferController.$inject = ['$location', 'MyService', 'LoginService', '$sessionStorage', "SessionStorageService", "UtilService"];

    function myAssetsTransferController($location, MyService, LoginService, $sessionStorage, SessionStorageService, UtilService) {
        var storeId = $sessionStorage.storeId;
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var vm = this;
        vm.myBalance = $sessionStorage.balance;
        vm.myName = $sessionStorage.memberName;
        vm.myMobile = $sessionStorage.mobile;
        vm.myPoint = $sessionStorage.point;
        vm.myTicketsCount = $sessionStorage.ticketsCount;
        var activited = $sessionStorage.activated;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        vm.doTransfer = doTransfer;
        vm.loginOtherAccount = loginOtherAccount;
        vm.goBack = goBack;

        function goBack() {
            $location.url('/my?storeId=' + storeId+ "&theme=" + theme);
        }

        function loginOtherAccount(mobile, password) {
            if(mobile == vm.myMobile){
                alert("不能转移给自己");
                return
            }
            LoginService.loginByVKApi(storeId, {mobile: mobile, password: password}).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    return
                }
                vm.hisCardId = data.cardId;
                vm.hisName = data.data.name;
                vm.hisMobile = data.data.mobile;
                vm.hisBalance = 0;
                if (data.data.balance) {
                    vm.hisBalance = data.data.balance;
                }
                vm.hisPoint = 0;
                if (data.data.point) {
                    vm.hisPoint = data.data.point;
                }

                vm.hisTicketsCount = 0;
                if (data.data.ticketsCount) {
                    vm.hisTicketsCount = data.data.ticketsCount;
                }

                vm.hisBalanceAfter = (vm.hisBalance + vm.myBalance).toFixed(2);
                vm.hisPointAfter = vm.hisPoint + vm.myPoint;
                var after = vm.hisTicketsCount + vm.myTicketsCount;
                vm.hisTicketsCountAfter = after.toFixed(0);

                vm.showDialog = false;
                // onGoBackClick();
            }, function (e) {
                //error msg
            });
        }

        function doTransfer() {
            if (!vm.hisCardId) {
                // alert("还有信息未填写");
                return
            }
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.doAssetsTransfer(cardId, token, storeId, vm.hisCardId).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    return
                }

                if(cardId =="" ||cardId=="null"||!cardId){
                    return
                }

                MyService.getMemberInfo(cardId, token).then(function (data) {
                    if (data.code != 200) {
                        alert(data.message);
                        console.log(data.message);
                        return
                    }
                    // if ($sessionStorage.balance != data.data.balance || $sessionStorage.point != data.data.point) {
                    SessionStorageService.setAllSessionStorage(data.data, function (res) {
                        $sessionStorage.memberName = $sessionStorage.name;
                        $sessionStorage.cardId = $sessionStorage.id;
                        $sessionStorage.activated = activited;
                    });

                    vm.balance = $sessionStorage.balance;
                    vm.points = $sessionStorage.point;
                    // }

                    UtilService.showToast(vm, "转移成功", goBack);
                });


            }, function (e) {
                //error msg
            });
        }
    }
})();
