(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaConfirmConversionController', HeyTeaConfirmConversionController);

    HeyTeaConfirmConversionController.$inject = ['$location', '$sessionStorage', 'PointShopService', 'ShoppingService'];

    /** @ngInject */
    function HeyTeaConfirmConversionController($location, $sessionStorage, PointShopService, ShoppingService) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var itemId = $location.search().itemId;

        var vm = this;
        vm.point = $sessionStorage.point;
        vm.goBack = goBack;
        vm.onStoreClick = onStoreClick;
        vm.confirm = confirm;

        PointShopService.getHeyTeaItemDetail(token, cardId, itemId).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                return
            }
            vm.detail = data.data;
        });

        var parma = {
            distance: 9999999999,  //10KM
            isTakeaway: 1,//外卖店
            latitude: $sessionStorage.latitude || 0,
            longitude: $sessionStorage.longitude || 0
            // latitude: 0,
            // longitude: 0
        };

        ShoppingService.getStores(storeId, token,cardId, parma).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                console.log(data.message);
                return
            }

            var obj = data.data;
            angular.forEach(obj, function (each) {
                each.address = each.address || "暂无地址";
                each.logo = each.logo || "http://img0.imgtn.bdimg.com/it/u=2528250507,4034175189&fm=11&gp=0.jpg";
                each.star = each.star || 5;
                each.stars = new Array(parseInt(each.star));
                each.unstars = new Array(5 - parseInt(each.star));
                each.tel = each.tel || "02865291601";
                each.businessHourss = each.businessHourss || "00:00 至 00:00"
            });

            vm.store = data.data[0];
            vm.stores = data.data;

        }, function (e) {
            //error msg
        });


        function onStoreClick(item) {
            vm.store = item;
            vm.showStoreListDialog = false
        }

        function goBack() {
            if(vm.showStoreListDialog){
                vm.showStoreListDialog = false;
                return
            }
            $location.url("/heytea-pointShop?storeId=" + storeId);
        }

        function confirm() {
            var data;
            // if (vm.detail.type == 0) {
            //     data = {
            //         cardId: cardId,
            //         storeId: storeId,
            //         pointProductId: itemId,
            //         exchangeNum: 1,
            //         title: ''
            //     };
            // } else {
            data = {
                cardId: cardId,
                storeId: vm.store.id,
                pointProductId: itemId,
                exchangeNum: 1,
                title: '',
                detailedAddress: vm.store.address,
                mobile: $sessionStorage.mobile,
                proCityDis: 'test',
                remark:vm.remark
            };
            // }
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
                $sessionStorage.point = $sessionStorage.point - vm.detail.point;
                vm.point = $sessionStorage.point;
                $location.url("/heytea-exchangeSuccess?storeId=" + storeId);
            });
            //TODO
            // $location.url("/exchangeSuccess?storeId=" + storeId);
        }
    }
})();
