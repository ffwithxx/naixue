(function () {
    'use strict';

    angular
        .module('vk')
        .controller('storeDetailController', storeDetailController);

    /** @ngInject */
    storeDetailController.$inject = ['$location', '$sessionStorage', 'ShoppingService', 'SessionStorageService', 'BaiduMapService'];

    function storeDetailController($location, $sessionStorage, ShoppingService, SessionStorageService, BaiduMapService) {
        var vm = this;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        vm.latitude = $sessionStorage.latitude;
        vm.longitude = $sessionStorage.longitude;
        vm.store = $sessionStorage.curStore;


        if (!vm.latitude || !vm.longitude) {
            vm.latitude = 0;
            vm.longitude = 0;
        }
        vm.distance = 0;
        vm.goBack = goBack;
        vm.order = order;
        vm.goAddressMap = goAddressMap;

        //init location
        BaiduMapService.setMyLocation();

        function order(orderType) {
            $location.url("/orderList?storeId=" + storeId
                + "&orderType=" + orderType);
        }

        function goBack() {
            $location.url('/shopping?storeId=' + storeId)
        }

        function goAddressMap() {
            $location.url('/addressMap?storeId=' + storeId);
        }

        // vm.requestStores = requestStores;
        //
        // if(!$sessionStorage.hasStoreLoaded){
        //     requestStores();
        // }
        //
        // function requestStores() {
        //     ShoppingService.getStores(storeId, token, vm).then(function (data) {
        //         if (data.code != 200) {
        //             alert(data.message);
        //             console.log(data.message);
        //             return
        //         }
        //         SessionStorageService.setOneSessionStorage("hasStoreLoaded", true);
        //
        //     }, function (e) {
        //         //error msg
        //     });
        //
        // }


    }
})();
