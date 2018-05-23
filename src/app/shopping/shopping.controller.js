(function () {
    'use strict';

    angular
        .module('vk')
        .controller('ShoppingController', ShoppingController);

    ShoppingController.$inject = ['$location', '$sessionStorage', 'ShoppingService', 'SessionStorageService', 'UtilService'];

    /** @ngInject */
    function ShoppingController($location, $sessionStorage, ShoppingService, SessionStorageService, UtilService) {
        var vm = this;
        var storeId = $sessionStorage.storeId;
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        vm.goStoreDetail = goStoreDetail;
        var s = !$sessionStorage.lat;
        var r = !$sessionStorage.lng;


        getStoreList();
        // if (!$sessionStorage.lat || !$sessionStorage.lng) {
        //
        //     var geolocation = new BMap.Geolocation();
        //     geolocation.getCurrentPosition(function(r){
        //         if(this.getStatus() == BMAP_STATUS_SUCCESS){
        //             SessionStorageService.setOneSessionStorage("lat", r.point.lat);
        //             SessionStorageService.setOneSessionStorage("lng", r.point.lng);
        //         }
        //         else {
        //             alert('failed'+this.getStatus());
        //         }
        //     },{enableHighAccuracy: true})
        // }

        function getStoreList() {
            var parma = {
                distance: 9999999999,  //10KM
                isTakeaway: 1,//外卖店
                latitude: 0,
                longitude: 0
                // latitude: 29.395101,
                // longitude: 113.190573
            };

            // lat: 29.395101
            // lon: 113.190573

            ShoppingService.getStores(storeId, token,cardId, parma).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    console.log(data.message);
                    return
                }
                var obj = data.data;

                var logo = "./assets/images/VK/defStoreLogo.png";
                if($sessionStorage.theme == "black"){
                    logo = "./assets/images/black/blackStoreLogo.png";
                }

                angular.forEach(obj, function (each) {
                    each.address = each.address || "暂无地址";
                    each.logo = each.logo || logo;
                    each.star = each.star || 5;
                    each.stars = new Array(parseInt(each.star));
                    each.unstars = new Array(5 - parseInt(each.star));
                    each.tel = each.tel || "02865291601";
                    each.businessHourss = each.businessHourss || "00:00 至 00:00"
                    each.distance = each.distance / 1000
                });

                vm.stores = data.data;

            }, function (e) {
                //error msg
            });

        }

        function goStoreDetail(detailInfo) {
          SessionStorageService.setOneSessionStorage("curStore", detailInfo);
          $location.url("/orderList?storeId=" + storeId + "&subStoreId=" + detailInfo.id
              + "&orderType=selfOrder");
          //   $location.url("/storeDetail?storeId=" + storeId);
        }
    }
})();
