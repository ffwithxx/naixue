(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaConversionDetailController', HeyTeaConversionDetailController);

    HeyTeaConversionDetailController.$inject = ['$location', '$sessionStorage', 'PointShopService', 'MyService', 'SessionStorageService'];

    /** @ngInject */
    function HeyTeaConversionDetailController($location, $sessionStorage, PointShopService, MyService, SessionStorageService) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var itemId = $location.search().itemId;

        var vm = this;
        vm.point = $sessionStorage.point;
        vm.goBack = goBack;
        vm.goConversionFirst = goConversionFirst;

        PointShopService.getHeyTeaItemDetail(token, cardId, itemId).then(function (res) {
            vm.detail = res.data;
        });


        function goBack() {
            $location.url("/heytea-pointShop?storeId=" + storeId);
        }

        function goConversionFirst(item) {

            if (item.type == 0) {//虚拟品
                var data = {
                    cardId: cardId,
                    storeId: storeId,
                    pointProductId: item.id,
                    exchangeNum: 1,
                    mobile: $sessionStorage.mobile,
                    title: ''
                };
                PointShopService.goHeyTeaExchange(token,cardId,data).then(function (data) {
                    //go success
                    if (data.code != 200) {
                        if (data.code == 1007) {
                            alert("积分不足,无法兑换.");
                            return
                        }
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
                        if ($sessionStorage.balance != data.data.balance || $sessionStorage.point != data.data.point) {
                            SessionStorageService.setAllSessionStorage(data.data, function (res) {
                                $sessionStorage.memberName = $sessionStorage.name;
                                $sessionStorage.cardId = $sessionStorage.id;
                            });

                            vm.balance = $sessionStorage.balance;
                            vm.points = $sessionStorage.point;
                            // return
                        }

                        // refreshUserInfo()
                        $location.url("/heytea-exchangeSuccess?storeId=" + storeId);
                    });


                });
            } else {
                $location.url("/heytea-confirmConversion?storeId=" + storeId + "&itemId=" + item.id);
            }

        }
    }
})();
