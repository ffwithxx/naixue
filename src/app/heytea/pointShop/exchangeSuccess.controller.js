(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaExchangeSuccessController', HeyTeaExchangeSuccessController);

    HeyTeaExchangeSuccessController.$inject = ['$location', '$sessionStorage', 'PointShopService'];

    /** @ngInject */
    function HeyTeaExchangeSuccessController($location, $sessionStorage, PointShopService) {
        var storeId = $sessionStorage.storeId;

        var vm = this;
        vm.goBack = goBack;
        vm.goConversionRecord = goConversionRecord;

        function goBack() {
            $location.url("/heytea-pointShop?storeId=" + storeId);
        }

        function goConversionRecord() {
            $location.url("/heytea-conversionRecord?storeId=" + storeId);
        }
    }
})();
