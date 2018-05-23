(function () {
    'use strict';

    angular
        .module('vk')
        .controller('ConversionDetailController', ConversionDetailController);

    ConversionDetailController.$inject = ['$location', '$sessionStorage', 'PointShopService', 'MyService', 'SessionStorageService','$sce'];

    /** @ngInject */
    function ConversionDetailController($location, $sessionStorage, PointShopService, MyService, SessionStorageService,$sce) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var itemId = $location.search().itemId;

        var vm = this;

        vm.point = $sessionStorage.point;
        vm.goBack = goBack;
        vm.goConversionFirst = goConversionFirst;
        PointShopService.getItemDetail(token, cardId, itemId).then(function (res) {
            vm.detail = res.data;
        });
        vm.getvalue = getvalue;
        vm.getconditions = getconditions;

        // vm.showModle = showModle;
        function goBack() {
            $location.url("/pointShop?storeId=" + storeId);
        }
        function getconditions(item) {
            if  (!item) {

                return
            }

            if ((item.conditionsLevels == "null" || item.conditionsLevels == "" || !item.conditionsLevels) && (item.conditionsTickets == "null" || item.conditionsTickets == "" || !item.conditionsTickets)) {

                return""
            }
            if (item.payType == 0) {

                return "[兑换条件]"  + item.conditionsLevels +item.conditionsTickets;

            }else  {
                return "[购买条件]"  + item.conditionsLevels +item.conditionsTickets;

            }

        }

        // function showModle(type) {
        //     if (type == 0) {
        //
        //         return YES;
        //     }else  {
        //
        //         return NO;
        //     }
        //
        // }
        function getvalue(item) {
            if  (!item) {
                return
            }
            if (item.payType == 0) {
                return item.point;
            }else  {

                return "￥"+item.price;
            }

        }
        function goConversionFirst(item) {
            //
            // if (item.type == 0) {//虚拟品
            //     var data = {
            //         cardId: cardId,
            //         storeId: storeId,
            //         pointProductId: item.id,
            //         exchangeNum: 1,
            //         mobile: $sessionStorage.mobile,
            //         title: ''
            //     };
            //     if(cardId =="" ||cardId=="null"||!cardId){
            //         return
            //     }
            //     PointShopService.goExchange(token,cardId,data).then(function (data) {
            //         //go success
            //         if (data.code != 200) {
            //             if (data.code == 1007) {
            //                 alert("积分不足,无法兑换.");
            //                 return
            //             }
            //             alert(data.message);
            //             return
            //         }
            //         if(cardId =="" ||cardId=="null"||!cardId){
            //             return
            //         }
            //         MyService.getMemberInfo(cardId, token).then(function (data) {
            //             if (data.code != 200) {
            //                 alert(data.message);
            //                 console.log(data.message);
            //                 return
            //             }
            //             if ($sessionStorage.balance != data.data.balance || $sessionStorage.point != data.data.point) {
            //                 SessionStorageService.setAllSessionStorage(data.data, function (res) {
            //                     $sessionStorage.memberName = $sessionStorage.name;
            //                     $sessionStorage.cardId = $sessionStorage.id;
            //                 });
            //
            //                 vm.balance = $sessionStorage.balance;
            //                 vm.points = $sessionStorage.point;
            //                 // return
            //             }
            //
            //             // refreshUserInfo()
            //             $location.url("/exchangeSuccess?storeId=" + storeId);
            //         });
            //
            //
            //     });
            // } else {
            $location.url("/confirmConversion?storeId=" + storeId + "&itemId=" + item.id);
            // }

        }
    }
})();
