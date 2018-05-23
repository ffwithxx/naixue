(function () {
    'use strict';

    angular
        .module('vk')
        .controller('ExchangeSuccessController', ExchangeSuccessController);

    ExchangeSuccessController.$inject = ['$location', '$sessionStorage', 'PointShopService'];

    /** @ngInject */
    function ExchangeSuccessController($location, $sessionStorage, PointShopService) {
        var storeId = $sessionStorage.storeId;

        var vm = this;
        vm.goBack = goBack;
        vm.goConversionRecord = goConversionRecord;

        function goBack() {
            $location.url("/pointShop?storeId=" + storeId);
        }

        function goConversionRecord() {
            $location.url("/conversionRecord?storeId=" + storeId);
        }
    }
})();
